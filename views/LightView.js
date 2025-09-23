class LightView {
  constructor() {
    this.elements = {
      toggleButton: document.getElementById('lightToggle'),
      statusIndicator: document.getElementById('statusIndicator'),
      statusText: document.getElementById('statusText'),
      lightIcon: document.getElementById('lightIcon'),
      loadingSpinner: document.getElementById('loadingSpinner')
    };
    
    this.currentState = null;
    this.isLoading = false;
  }

  // Renderiza o estado atual da luz
  renderLightState(state) {
    this.currentState = state;
    
    if (state === 'on') {
      this.showLightOn();
    } else if (state === 'off') {
      this.showLightOff();
    } else {
      this.showUnknownState();
    }
    
    this.hideLoading();
  }

  // Mostra luz ligada
  showLightOn() {
    this.elements.toggleButton.textContent = 'Desligar';
    this.elements.toggleButton.className = 'toggle-btn on';
    this.elements.statusIndicator.className = 'status-indicator on';
    this.elements.statusText.textContent = 'Ligada';
    this.elements.lightIcon.className = 'light-icon on';
    this.elements.toggleButton.disabled = false;
  }

  // Mostra luz desligada
  showLightOff() {
    this.elements.toggleButton.textContent = 'Ligar';
    this.elements.toggleButton.className = 'toggle-btn off';
    this.elements.statusIndicator.className = 'status-indicator off';
    this.elements.statusText.textContent = 'Desligada';
    this.elements.lightIcon.className = 'light-icon off';
    this.elements.toggleButton.disabled = false;
  }

  // Mostra estado desconhecido
  showUnknownState() {
    this.elements.toggleButton.textContent = 'Conectando...';
    this.elements.toggleButton.className = 'toggle-btn unknown';
    this.elements.statusIndicator.className = 'status-indicator unknown';
    this.elements.statusText.textContent = 'Conectando...';
    this.elements.lightIcon.className = 'light-icon unknown';
    this.elements.toggleButton.disabled = true;
  }

  // Mostra loading
  showLoading() {
    this.isLoading = true;
    this.elements.loadingSpinner.style.display = 'block';
    this.elements.toggleButton.disabled = true;
  }

  // Esconde loading
  hideLoading() {
    this.isLoading = false;
    this.elements.loadingSpinner.style.display = 'none';
  }

  // Mostra erro
  showError(message) {
    this.hideLoading();
    
    // Cria notificação de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove após 3 segundos
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 3000);
  }

  // Adiciona listener para o botão
  onToggleClick(callback) {
    this.elements.toggleButton.addEventListener('click', () => {
      if (!this.isLoading && this.currentState !== null) {
        const newState = this.currentState === 'on' ? 'off' : 'on';
        this.showLoading();
        callback(newState);
      }
    });
  }

  // Método para atualizar a interface de forma suave
  updateWithAnimation(state) {
    this.elements.toggleButton.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      this.renderLightState(state);
      this.elements.toggleButton.style.transform = 'scale(1)';
    }, 100);
  }
}

export default LightView;