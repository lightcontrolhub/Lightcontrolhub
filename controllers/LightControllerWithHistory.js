import FirebaseLightRepository from '../repositories/FirebaseLightRepository.js';
import LightService from '../services/LightService.js';
import LightView from '../views/LightView.js';

/**
 * Controller de Lâmpada com Histórico
 * Atualizado para usar Repository Pattern e Service Layer
 */
class LightControllerWithHistory {
  
  constructor(authModel) {
    // Dependency Injection
    this.lightRepository = new FirebaseLightRepository(
      'https://teste-9142b-default-rtdb.firebaseio.com',
      'dispositivo-do-breno'
    );
    
    this.lightService = new LightService(this.lightRepository);
    this.view = new LightView();
    this.authModel = authModel;
    this.lightId = 'dispositivo-do-breno';
    
    // Estado interno
    this.isInitialized = false;
    this.historyVisible = false;
    
    this.init();
  }
  
  async init() {
    try {
      // Configura usuário atual no service
      if (this.authModel && this.authModel.user) {
        this.lightService.setCurrentUser(this.authModel.user);
      }
      
      // Configura listeners da view
      this.setupViewListeners();
      
      // Carrega estado inicial
      await this.loadInitialState();
      
      // Carrega histórico recente
      await this.loadRecentHistory();
      
      this.isInitialized = true;
      console.log('🏠 LightController com histórico inicializado');
      
    } catch (error) {
      console.error('Erro ao inicializar controller:', error);
      this.view.showError('Erro ao conectar com o sistema');
    }
  }
  
  setupViewListeners() {
    // Toggle básico da lâmpada
    this.view.onToggleClick(async (newState) => {
      await this.handleToggleLight();
    });
    
    // Listeners para histórico (serão implementados na view estendida)
    document.addEventListener('click', (e) => {
      if (e.target.id === 'showHistory') {
        this.toggleHistoryView();
      } else if (e.target.id === 'refreshHistory') {
        this.loadRecentHistory();
      } else if (e.target.id === 'showStats') {
        this.showDailyStats();
      } else if (e.target.id === 'showReport') {
        this.showWeeklyReport();
      }
    });
  }
  
  async loadInitialState() {
    try {
      this.view.showLoading();
      
      const status = await this.lightService.getLightStatus(this.lightId);
      this.view.renderLightState(status.state);
      
      // Atualiza informações extras na UI
      this.updateExtraInfo(status);
      
    } catch (error) {
      console.error('Erro ao carregar estado inicial:', error);
      this.view.showError('Erro ao carregar estado inicial');
    }
  }
  
  async handleToggleLight() {
    try {
      this.view.showLoading();
      
      const result = await this.lightService.toggleLight(this.lightId);
      
      // Atualiza view com novo estado
      this.view.renderLightState(result.newState);
      
      // Mostra feedback da mudança
      const message = `💡 Lâmpada ${result.newState === 'on' ? 'ligada' : 'desligada'}`;
      const duration = result.duration ? ` (estava ligada ${result.duration})` : '';
      this.showSuccessMessage(message + duration);
      
      // Atualiza histórico
      await this.loadRecentHistory();
      
      console.log('🔄 Toggle concluído:', result);
      
    } catch (error) {
      console.error('Erro ao alternar lâmpada:', error);
      this.view.showError(`Erro: ${error.message}`);
    }
  }
  
  async loadRecentHistory() {
    try {
      const history = await this.lightService.getHistory(this.lightId, { limit: 5 });
      this.updateHistoryUI(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }
  
  async showDailyStats() {
    try {
      this.showLoadingOverlay('Calculando estatísticas...');
      
      const stats = await this.lightService.getDailyStats(this.lightId);
      this.displayStatsModal(stats);
      
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      this.view.showError('Erro ao calcular estatísticas');
    } finally {
      this.hideLoadingOverlay();
    }
  }
  
  async showWeeklyReport() {
    try {
      this.showLoadingOverlay('Gerando relatório semanal...');
      
      const report = await this.lightService.getWeeklyReport(this.lightId);
      this.displayReportModal(report);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      this.view.showError('Erro ao gerar relatório');
    } finally {
      this.hideLoadingOverlay();
    }
  }
  
  toggleHistoryView() {
    this.historyVisible = !this.historyVisible;
    const historyPanel = document.getElementById('historyPanel');
    
    if (historyPanel) {
      historyPanel.style.display = this.historyVisible ? 'block' : 'none';
      
      if (this.historyVisible) {
        this.loadRecentHistory();
      }
    }
  }
  
  // ===== MÉTODOS DE UI =====
  
  updateExtraInfo(status) {
    // Atualiza informações extras na UI (timestamp, etc.)
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated && status.lastUpdated) {
      const date = new Date(status.lastUpdated);
      lastUpdated.textContent = `Última atualização: ${date.toLocaleString('pt-BR')}`;
    }
  }
  
  updateHistoryUI(history) {
    const historyContainer = document.getElementById('historyList');
    if (!historyContainer) return;
    
    if (history.length === 0) {
      historyContainer.innerHTML = '<p class="no-history">Nenhum histórico encontrado</p>';
      return;
    }
    
    const historyHTML = history.map(item => `
      <div class="history-item ${item.toState}">
        <div class="history-icon">
          ${item.toState === 'on' ? '💡' : '🌙'}
        </div>
        <div class="history-details">
          <div class="history-action">${item.actionDescription}</div>
          <div class="history-time">${item.timestampFormatted}</div>
          ${item.durationFormatted ? `<div class="history-duration">Duração: ${item.durationFormatted}</div>` : ''}
        </div>
      </div>
    `).join('');
    
    historyContainer.innerHTML = historyHTML;
  }
  
  displayStatsModal(stats) {
    const modal = this.createModal('Estatísticas Diárias', `
      <div class="stats-container">
        <div class="stat-card">
          <h4>⏰ Tempo Total Ligada</h4>
          <p class="stat-value">${stats.totalOnTimeFormatted}</p>
        </div>
        
        <div class="stat-card">
          <h4>🔄 Mudanças de Estado</h4>
          <p class="stat-value">${stats.totalChanges}</p>
        </div>
        
        <div class="stat-card">
          <h4>📊 Eficiência</h4>
          <p class="stat-value">${stats.efficiency.usagePercent}%</p>
          <p class="stat-category">${stats.efficiency.category}</p>
        </div>
        
        <div class="stat-card">
          <h4>🕐 Horário Mais Ativo</h4>
          <p class="stat-value">${stats.mostActiveHour.hour}:00</p>
          <p class="stat-detail">${stats.mostActiveHour.count} mudanças</p>
        </div>
        
        <div class="timeline-section">
          <h4>📈 Linha do Tempo</h4>
          <div class="timeline">
            ${this.renderTimeline(stats.timeline)}
          </div>
        </div>
      </div>
    `);
    
    document.body.appendChild(modal);
  }
  
  displayReportModal(report) {
    const modal = this.createModal('Relatório Semanal', `
      <div class="report-container">
        <div class="report-summary">
          <h4>📊 Resumo da Semana</h4>
          <p>Tempo total ligada: <strong>${report.summary.totalOnTimeFormatted}</strong></p>
          <p>Mudanças: <strong>${report.summary.totalChanges}</strong></p>
          <p>Sessões: <strong>${report.summary.onEvents}</strong></p>
        </div>
        
        <div class="daily-breakdown">
          <h4>📅 Breakdown Diário</h4>
          ${report.dailyBreakdown.map(day => `
            <div class="day-item">
              <strong>${day.dayName}</strong>
              <span>${day.totalOnTimeFormatted}</span>
              <small>${day.efficiency.category}</small>
            </div>
          `).join('')}
        </div>
        
        <div class="recommendations">
          <h4>💡 Recomendações</h4>
          ${report.recommendations.map(rec => `
            <div class="recommendation ${rec.priority}">
              <strong>${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}</strong>
              <p>${rec.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `);
    
    document.body.appendChild(modal);
  }
  
  renderTimeline(timeline) {
    if (!timeline || timeline.length === 0) {
      return '<p>Sem dados de timeline</p>';
    }
    
    return timeline.map(period => {
      const startTime = new Date(period.start).toLocaleTimeString('pt-BR');
      const endTime = new Date(period.end).toLocaleTimeString('pt-BR');
      const duration = this.formatDuration(period.duration);
      
      return `
        <div class="timeline-period ${period.status}">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <span class="timeline-time">${startTime} - ${endTime}</span>
            <span class="timeline-duration">${duration}</span>
            <span class="timeline-status">${period.status === 'on' ? 'Ligada' : 'Desligada'}</span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    // Event listener para fechar
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  }
  
  showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
  
  showLoadingOverlay(message = 'Carregando...') {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p>${message}</p>
    `;
    
    document.body.appendChild(overlay);
  }
  
  hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.remove();
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
  
  // ===== CLEANUP =====
  
  destroy() {
    // Para listeners, limpa recursos
    this.isInitialized = false;
    console.log('🏠 Controller destruído');
  }
}

export default LightControllerWithHistory;