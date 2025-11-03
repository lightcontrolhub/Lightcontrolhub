import LightModel from '../models/LightModel.js';
import AuthService from '../service/AuthService.js';
import AuthView from '../views/AuthView.js';

class AppController {
    constructor() {
        this.lightService = new LightModel(this.authModel);
        this.view = new AuthView();
        this.currentEmail = '';
        this.authService = AuthService.getInstance();    this.init();
  }

  async init() {
    this.setupEventListeners();

    if (this.authService.isAuthenticated()) {
      const isValid = await this.authService.verifyToken();
      if (isValid) {
        this.showLightControl();
      } else {
        this.authService.logout();
        this.view.showLogin();
      }
    } else {
      this.view.showLogin();
    }
  }

  setupEventListeners() {
    this.view.onFormSubmit((formId, formData) => {
      this.handleFormSubmit(formId, formData);
    });

    this.view.onButtonClick((buttonId) => {
      this.handleButtonClick(buttonId);
    });
  }

  async handleFormSubmit(formId, formData) {
    this.view.showLoading(true);

    try {
      switch (formId) {
        case 'loginForm':
          await this.handleLogin(formData);
          break;
        case 'registerForm':
          await this.handleRegister(formData);
          break;
        case 'verificationForm':
          await this.handleVerification(formData);
          break;
      }
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    } finally {
      this.view.showLoading(false);
    }
  }

  async handleButtonClick(buttonId) {
    try {
      switch (buttonId) {
        case 'showRegister':
          this.view.showRegister();
          break;
        case 'showLogin':
          this.view.showLogin();
          break;
        case 'resendCode':
          await this.resendCode();
          break;
        case 'logoutBtn':
          this.logout();
          break;
        case 'lightToggle':
          await this.toggleLight();
          break;
      }
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    }
  }

  async handleLogin(formData) {
    const email = formData.email;
    const password = formData.password;

    this.currentEmail = email;

    // Envia código de verificação
    const codeResult = await this.authModel.sendVerificationCode(email);
    this.view.showMessage(`📧 ${codeResult.message}\nCódigo: ${codeResult.code}`, 'success');

    this.view.showVerification(email);
  }

  async handleRegister(formData) {
    const email = formData.email;
    const password = formData.password;

    await this.authService.register(email, password);
    this.currentEmail = email;

    // Envia código de verificação
    const codeResult = await this.authService.sendVerificationCode(email);
    this.view.showMessage(`📧 ${codeResult.message}\nCódigo: ${codeResult.code}`, 'success');

    this.view.showVerification(email);
  }

  async handleVerification(formData) {
    const code = formData.code;

    await this.authService.verifyCode(this.currentEmail, code);

    // Agora faz login real
    const password = prompt('Digite sua senha novamente:');
    await this.authService.login(this.currentEmail, password);

    this.showLightControl();
  }

  async resendCode() {
    this.view.showLoading(true);
    try {
      const result = await this.authService.sendVerificationCode(this.currentEmail);
      this.view.showMessage(`📧 ${result.message}\nNovo código: ${result.code}`, 'success');
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    } finally {
      this.view.showLoading(false);
    }
  }

  logout() {
    this.authService.logout();
    this.lightService.stopListening();
    window.location.href = 'index.html';
  }

  showLightControl() {
    // Redireciona para a tela com histórico
    window.location.href = 'sistema-com-historico.html';
  }

  startLightMonitoring() {
    this.lightService.listenToLightState((state) => {
      if (state !== null) {
        this.view.updateLightState(state);
      }
    });
  }

  async toggleLight() {
    this.view.showLoading(true);

    try {
      const currentState = await this.lightService.getCurrentState();
      const newState = currentState === 'on' ? 'off' : 'on';

      await this.lightService.setLightState(newState);
      this.view.updateLightState(newState);
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    } finally {
      this.view.showLoading(false);
    }
  }
}

export default AppController;