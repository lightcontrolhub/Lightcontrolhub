/**
 * Service de Lâmpada com Histórico
 * Contém a lógica de negócio para controle e histórico de lâmpadas
 */
class LightService {
  
  constructor(lightRepository, authService = null) {
    this.lightRepository = lightRepository;
    this.authService = authService;
    this.currentUser = null;
  }
  
  setCurrentUser(user) {
    this.currentUser = user;
  }
  
  // ===== OPERAÇÕES BÁSICAS =====
  
  async toggleLight(lightId) {
    try {
      // Obtém estado atual
      const currentState = await this.lightRepository.getCurrentState(lightId);
      const newState = currentState === 'on' ? 'off' : 'on';
      const timestamp = Date.now();
      
      // Calcula duração se estava ligada
      let duration = null;
      if (currentState === 'on') {
        duration = await this.calculateLastSessionDuration(lightId);
      }
      
      // Salva novo estado
      const light = {
        id: lightId,
        state: newState,
        timestamp,
        userId: this.currentUser?.userId || 'anonymous'
      };
      
      await this.lightRepository.save(light);
      
      // Registra no histórico
      await this.lightRepository.logStateChange({
        lightId,
        fromState: currentState,
        toState: newState,
        timestamp,
        userId: this.currentUser?.userId || 'anonymous',
        duration
      });
      
      console.log(`🔄 Lâmpada ${lightId}: ${currentState} → ${newState}`);
      
      return {
        success: true,
        lightId,
        previousState: currentState,
        newState,
        timestamp,
        duration: duration ? this.formatDuration(duration) : null
      };
      
    } catch (error) {
      console.error('Erro ao alternar lâmpada:', error);
      throw new Error(`Falha ao alternar lâmpada: ${error.message}`);
    }
  }
  
  async getLightStatus(lightId) {
    try {
      const light = await this.lightRepository.findById(lightId);
      const recentChanges = await this.lightRepository.getRecentChanges(lightId, 3);
      
      return {
        ...light,
        recentChanges
      };
    } catch (error) {
      console.error('Erro ao obter status:', error);
      throw new Error(`Falha ao obter status: ${error.message}`);
    }
  }
  
  // ===== OPERAÇÕES DE HISTÓRICO =====
  
  async getHistory(lightId, filters = {}) {
    try {
      const history = await this.lightRepository.getHistory(lightId, filters);
      
      // Enriquece dados do histórico
      return history.map(change => ({
        ...change,
        durationFormatted: change.duration ? this.formatDuration(change.duration) : null,
        timestampFormatted: new Date(change.timestamp).toLocaleString('pt-BR'),
        actionDescription: this.getActionDescription(change)
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error(`Falha ao buscar histórico: ${error.message}`);
    }
  }
  
  async getDailyStats(lightId, date = new Date()) {
    try {
      const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      
      const stats = await this.lightRepository.getUsageStats(lightId, 'day');
      const history = await this.lightRepository.getHistory(lightId, { startDate, endDate });
      
      return {
        date: startDate.toDateString(),
        ...stats,
        timeline: this.buildTimeline(history),
        efficiency: this.calculateEfficiency(stats)
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas diárias:', error);
      throw new Error(`Falha ao calcular estatísticas: ${error.message}`);
    }
  }
  
  async getWeeklyReport(lightId) {
    try {
      const stats = await this.lightRepository.getUsageStats(lightId, 'week');
      const now = new Date();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Dados por dia da semana
      const dailyData = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
        const dayStats = await this.getDailyStats(lightId, day);
        dailyData.push({
          day: day.toDateString(),
          dayName: day.toLocaleDateString('pt-BR', { weekday: 'long' }),
          ...dayStats
        });
      }
      
      return {
        period: 'Últimos 7 dias',
        summary: stats,
        dailyBreakdown: dailyData,
        recommendations: this.generateRecommendations(stats, dailyData)
      };
    } catch (error) {
      console.error('Erro ao gerar relatório semanal:', error);
      throw new Error(`Falha ao gerar relatório: ${error.message}`);
    }
  }
  
  // ===== MÉTODOS AUXILIARES =====
  
  async calculateLastSessionDuration(lightId) {
    try {
      const recent = await this.lightRepository.getRecentChanges(lightId, 10);
      const lastOnEvent = recent.find(change => change.toState === 'on');
      
      if (lastOnEvent) {
        return Date.now() - lastOnEvent.timestamp;
      }
      return null;
    } catch (error) {
      console.error('Erro ao calcular duração da sessão:', error);
      return null;
    }
  }
  
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  getActionDescription(change) {
    const time = new Date(change.timestamp).toLocaleTimeString('pt-BR');
    const action = change.toState === 'on' ? 'ligou' : 'desligou';
    const duration = change.duration ? ` (ficou ligada ${this.formatDuration(change.duration)})` : '';
    
    return `${action.charAt(0).toUpperCase() + action.slice(1)} às ${time}${duration}`;
  }
  
  buildTimeline(history) {
    // Constrói linha do tempo com períodos ligado/desligado
    const timeline = [];
    let currentStatus = 'off';
    let periodStart = null;
    
    history.sort((a, b) => a.timestamp - b.timestamp);
    
    for (const change of history) {
      if (change.toState !== currentStatus) {
        if (periodStart) {
          timeline.push({
            status: currentStatus,
            start: periodStart,
            end: change.timestamp,
            duration: change.timestamp - periodStart
          });
        }
        currentStatus = change.toState;
        periodStart = change.timestamp;
      }
    }
    
    // Adiciona período atual se existe
    if (periodStart) {
      timeline.push({
        status: currentStatus,
        start: periodStart,
        end: Date.now(),
        duration: Date.now() - periodStart
      });
    }
    
    return timeline;
  }
  
  calculateEfficiency(stats) {
    // Calcula eficiência baseada em uso vs tempo disponível
    const totalPeriod = 24 * 60 * 60 * 1000; // 24 horas em ms
    const usagePercent = (stats.totalOnTime / totalPeriod) * 100;
    
    let rating = 'normal';
    if (usagePercent > 75) rating = 'alto';
    else if (usagePercent < 25) rating = 'baixo';
    
    return {
      usagePercent: Math.round(usagePercent * 100) / 100,
      rating,
      category: this.getUsageCategory(usagePercent)
    };
  }
  
  getUsageCategory(percent) {
    if (percent > 80) return 'Uso intensivo';
    if (percent > 50) return 'Uso moderado';
    if (percent > 20) return 'Uso leve';
    return 'Uso esporádico';
  }
  
  generateRecommendations(weeklyStats, dailyData) {
    const recommendations = [];
    
    // Recomendação baseada em padrão de uso
    const avgDailyUsage = weeklyStats.totalOnTime / 7;
    if (avgDailyUsage > 12 * 60 * 60 * 1000) { // Mais de 12h/dia
      recommendations.push({
        type: 'energia',
        message: 'Considere usar lâmpadas LED de baixo consumo para economia de energia.',
        priority: 'high'
      });
    }
    
    // Recomendação baseada em horário mais ativo
    if (weeklyStats.mostActiveHour.hour < 6 || weeklyStats.mostActiveHour.hour > 22) {
      recommendations.push({
        type: 'saude',
        message: 'Uso frequente durante madrugada pode afetar o sono. Considere reduzir o brilho.',
        priority: 'medium'
      });
    }
    
    // Recomendação baseada em frequência de mudanças
    if (weeklyStats.totalChanges > 50) {
      recommendations.push({
        type: 'automacao',
        message: 'Muitas mudanças manuais. Considere usar sensores ou automação.',
        priority: 'low'
      });
    }
    
    return recommendations;
  }
}

export default LightService;