import LightService from '../service/LightService.js';
import LightView from '../views/LightView.js';

class LightController {
  constructor(firebaseUrl, deviceId) {
    this.LightService = new LightService(firebaseUrl, deviceId);
    this.view = new LightView();
    this.isInitialized = false;

    this.init();
  }

  // Inicializa o controller
  async init() {
    try {
      // Configura listeners da view
      this.setupViewListeners();

      // Configura listeners do model
      this.setupModelListeners();

      // Carrega estado inicial
      await this.loadInitialState();

      this.isInitialized = true;
      console.log('LightController inicializado com sucesso');

    } catch (error) {
      console.error('Erro ao inicializar controller:', error);
      this.view.showError('Erro ao conectar com o sistema');
    }
  }

  // Configura listeners da view
  setupViewListeners() {
    this.view.onToggleClick((newState) => {
      this.handleToggleLight(newState);
    });
  }

  // Configura listeners do model
  setupModelListeners() {
    this.LightService.listenToLightState((state, error) => {
      if (error) {
        console.error('Erro ao receber estado:', error);
        this.view.showError('Erro de conexão');
        return;
      }

      this.handleStateChange(state);
    });
  }

  // Carrega estado inicial
  async loadInitialState() {
    try {
      this.view.showLoading();
      const currentState = await this.LightService.getCurrentState();
      this.handleStateChange(currentState);
    } catch (error) {
      console.error('Erro ao carregar estado inicial:', error);
      this.view.showError('Erro ao carregar estado inicial');
    }
  }

  // Manipula mudança de estado da luz
  async handleToggleLight(newState) {
    try {
      // Valida o estado
      if (!this.LightService.isValidState(newState)) {
        throw new Error('Estado inválido');
      }

      // Envia comando para o model
      await this.LightService.setLightState(newState);

      console.log(`Comando enviado: ${newState}`);

    } catch (error) {
      console.error('Erro ao alterar estado da luz:', error);
      this.view.showError('Erro ao alterar estado da luz');
      this.view.hideLoading();
    }
  }

  // Manipula mudanças de estado vindas do Firebase
  handleStateChange(state) {
    console.log('Estado recebido:', state);

    if (state === null || state === undefined) {
      this.view.showUnknownState();
      return;
    }

    // Atualiza a view com animação
    this.view.updateWithAnimation(state);
  }

  // Método para limpar recursos
  destroy() {
    if (this.LightService && this.view) {
      // Para de escutar mudanças
      this.LightService.stopListening(this.handleStateChange.bind(this));
      console.log('Controller destruído');
    }
  }

  // Método para reconectar em caso de erro
  async reconnect() {
    try {
      this.view.showLoading();
      await this.loadInitialState();
      console.log('Reconectado com sucesso');
    } catch (error) {
      console.error('Erro ao reconectar:', error);
      this.view.showError('Erro ao reconectar');
    }
  }
}

export default LightController;