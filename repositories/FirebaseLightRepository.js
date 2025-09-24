import ILightRepository from './interfaces/ILightRepository.js';

/**
 * Implementação Firebase do Repository de Lâmpadas com Histórico
 * Gerencia tanto estado atual quanto histórico de mudanças
 */
class FirebaseLightRepository extends ILightRepository {
  
  constructor(firebaseUrl, deviceId) {
    super();
    this.firebaseUrl = firebaseUrl;
    this.deviceId = deviceId;
    this.basePath = `/devices/${deviceId}`;
    this.historyPath = `/history/lights/${deviceId}`;
  }
  
  // ===== OPERAÇÕES BÁSICAS =====
  
  async save(light) {
    try {
      // Salva estado atual
      const stateUrl = `${this.firebaseUrl}${this.basePath}/current.json`;
      const stateData = {
        id: light.id,
        state: light.state,
        lastUpdated: light.timestamp || Date.now(),
        userId: light.userId
      };
      
      const response = await fetch(stateUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateData)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar no Firebase');
      }
      
      return { success: true, data: stateData };
    } catch (error) {
      throw new Error(`Erro ao salvar lâmpada: ${error.message}`);
    }
  }
  
  async findById(lightId) {
    try {
      const url = `${this.firebaseUrl}${this.basePath}/current.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Lâmpada não encontrada');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Erro ao buscar lâmpada: ${error.message}`);
    }
  }
  
  async getCurrentState(lightId) {
    try {
      const url = `${this.firebaseUrl}${this.basePath}/current/state.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return 'off'; // Estado padrão
      }
      
      const state = await response.json();
      return state || 'off';
    } catch (error) {
      console.error('Erro ao obter estado:', error);
      return 'off';
    }
  }
  
  // ===== OPERAÇÕES DE HISTÓRICO =====
  
  async logStateChange(change) {
    try {
      const changeId = `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `${this.firebaseUrl}${this.historyPath}/changes/${changeId}.json`;
      
      const changeData = {
        id: changeId,
        lightId: change.lightId,
        fromState: change.fromState,
        toState: change.toState,
        timestamp: change.timestamp || Date.now(),
        userId: change.userId,
        duration: change.duration || null,
        deviceInfo: {
          userAgent: navigator.userAgent,
          ip: 'client-side' // Seria obtido no backend
        }
      };
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changeData)
      });
      
      if (!response.ok) {
        throw new Error('Erro ao registrar mudança');
      }
      
      console.log(`📊 Histórico registrado: ${change.fromState} → ${change.toState}`);
      return changeId;
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      // Não falha a operação principal por erro de histórico
      return null;
    }
  }
  
  async getHistory(lightId, filters = {}) {
    try {
      const { startDate, endDate, limit = 50, offset = 0 } = filters;
      const url = `${this.firebaseUrl}${this.historyPath}/changes.json`;
      
      let queryUrl = url;
      if (startDate || endDate || limit) {
        const params = new URLSearchParams();
        if (startDate) params.append('startAt', startDate.getTime());
        if (endDate) params.append('endAt', endDate.getTime());
        if (limit) params.append('limitToLast', limit);
        queryUrl += '?' + params.toString();
      }
      
      const response = await fetch(queryUrl);
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      if (!data) return [];
      
      // Converte objeto em array e filtra por lightId
      return Object.values(data)
        .filter(change => change.lightId === lightId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(offset, offset + limit);
        
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }
  
  async getRecentChanges(lightId, limit = 10) {
    return this.getHistory(lightId, { limit });
  }
  
  async getTotalOnTime(lightId, startDate, endDate) {
    try {
      const history = await this.getHistory(lightId, { startDate, endDate, limit: 1000 });
      
      let totalTime = 0;
      let currentOnStart = null;
      
      // Ordena por timestamp crescente para calcular períodos
      history.sort((a, b) => a.timestamp - b.timestamp);
      
      for (const change of history) {
        if (change.toState === 'on') {
          currentOnStart = change.timestamp;
        } else if (change.toState === 'off' && currentOnStart) {
          totalTime += change.timestamp - currentOnStart;
          currentOnStart = null;
        }
      }
      
      // Se ainda está ligada, conta até agora
      if (currentOnStart) {
        totalTime += Date.now() - currentOnStart;
      }
      
      return totalTime; // Retorna em milissegundos
    } catch (error) {
      console.error('Erro ao calcular tempo total:', error);
      return 0;
    }
  }
  
  async getUsageStats(lightId, period = 'day') {
    try {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'day':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      const history = await this.getHistory(lightId, { startDate, endDate: now });
      const totalOnTime = await this.getTotalOnTime(lightId, startDate, now);
      
      const stats = {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalChanges: history.length,
        totalOnTime: totalOnTime,
        totalOnTimeFormatted: this.formatDuration(totalOnTime),
        onEvents: history.filter(h => h.toState === 'on').length,
        offEvents: history.filter(h => h.toState === 'off').length,
        averageSessionTime: 0,
        mostActiveHour: this.getMostActiveHour(history)
      };
      
      // Calcula tempo médio de sessão
      const onEvents = stats.onEvents;
      if (onEvents > 0) {
        stats.averageSessionTime = totalOnTime / onEvents;
        stats.averageSessionTimeFormatted = this.formatDuration(stats.averageSessionTime);
      }
      
      return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return null;
    }
  }
  
  // ===== MÉTODOS AUXILIARES =====
  
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  getMostActiveHour(history) {
    const hourCounts = {};
    
    history.forEach(change => {
      const hour = new Date(change.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let maxHour = 0;
    let maxCount = 0;
    
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });
    
    return { hour: maxHour, count: maxCount };
  }
}

export default FirebaseLightRepository;