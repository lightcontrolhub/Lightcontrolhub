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

    this.stateConfig = {
      on: {
        buttonText: 'Desligar',
        buttonClass: 'toggle-btn on',
        indicatorClass: 'status-indicator on',
        statusText: 'Ligada',
        iconClass: 'light-icon on',
        disabled: false
      },
      off: {
        buttonText: 'Ligar',
        buttonClass: 'toggle-btn off',
        indicatorClass: 'status-indicator off',
        statusText: 'Desligada',
        iconClass: 'light-icon off',
        disabled: false
      },
      unknown: {
        buttonText: 'Conectando...',
        buttonClass: 'toggle-btn unknown',
        indicatorClass: 'status-indicator unknown',
        statusText: 'Conectando...',
        iconClass: 'light-icon unknown',
        disabled: true
      }
    };
  }

  /**
   * Apply state configuration to UI elements (DRY)
   * @param {object} config - State configuration object
   */
  _applyStateConfig(config) {
    this.elements.toggleButton.textContent = config.buttonText;
    this.elements.toggleButton.className = config.buttonClass;
    this.elements.statusIndicator.className = config.indicatorClass;
    this.elements.statusText.textContent = config.statusText;
    this.elements.lightIcon.className = config.iconClass;
    this.elements.toggleButton.disabled = config.disabled;
  }

  /**
   * Renderiza estado
   * @param {string} state - State to render ('on', 'off', or 'unknown')
   */
  renderLightState(state) {
    this.currentState = state;

    const config = this.stateConfig[state] || this.stateConfig.unknown;
    this._applyStateConfig(config);

    this.hideLoading();
  }

  /**
   * Mostra luz ligada
   */
  showLightOn() {
    this.renderLightState('on');
  }

  /**
   * Mostra luz desligada
   */
  showLightOff() {
    this.renderLightState('off');
  }

  /**
   * Mostra estado desconhecido
   */
  showUnknownState() {
    this.renderLightState('unknown');
  }

  /**
   * Mostra loading
   */
  showLoading() {
    this.isLoading = true;
    this.elements.loadingSpinner.style.display = 'block';
    this.elements.toggleButton.disabled = true;
  }

  /**
   * Esconde loading
   */
  hideLoading() {
    this.isLoading = false;
    this.elements.loadingSpinner.style.display = 'none';
  }

  /**
   * Cria notificação de erro
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.hideLoading();

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

  /**
   * Adiciona listener para o botão
   * @param {Function} callback - Callback function with new state
   */
  onToggleClick(callback) {
    this.elements.toggleButton.addEventListener('click', () => {
      if (!this.isLoading && this.currentState !== null) {
        const newState = this.currentState === 'on' ? 'off' : 'on';
        this.showLoading();
        callback(newState);
      }
    });
  }

  /**
   * Update UI with smooth animation
   * @param {string} state - New state to display
   */
  updateWithAnimation(state) {
    this.elements.toggleButton.style.transform = 'scale(0.95)';

    setTimeout(() => {
      this.renderLightState(state);
      this.elements.toggleButton.style.transform = 'scale(1)';
    }, 100);
  }
}

export default LightView;