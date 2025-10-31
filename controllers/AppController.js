import LightModel from '../models/LightModel.js';
import AuthService from '../service/AuthService.js';
import AuthView from '../views/AuthView.js';

class AppController {
  constructor() {
    this.lightModel = new LightModel(this.authModel);
    this.view = new AuthView();
    this.currentEmail = '';
    this.AuthService = new AuthService();

    this.init();
  }

  async init() {
    this.setupEventListeners();

    if (this.authModel.isAuthenticated()) {
      const isValid = await this.AuthService.verifyToken();
      if (isValid) {
        this.showLightControl();
      } else {
        this.authModel.logout();
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

    await this.authModel.register(email, password);
    this.currentEmail = email;

    // Envia código de verificação
    const codeResult = await this.authModel.sendVerificationCode(email);
    this.view.showMessage(`📧 ${codeResult.message}\nCódigo: ${codeResult.code}`, 'success');

    this.view.showVerification(email);
  }

  async handleVerification(formData) {
    const code = formData.code;

    await this.authModel.verifyCode(this.currentEmail, code);

    // Agora faz login real
    const password = prompt('Digite sua senha novamente:');
    await this.authModel.login(this.currentEmail, password);

    this.showLightControl();
  }

  async resendCode() {
    this.view.showLoading(true);
    try {
      const result = await this.authModel.sendVerificationCode(this.currentEmail);
      this.view.showMessage(`📧 ${result.message}\nNovo código: ${result.code}`, 'success');
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    } finally {
      this.view.showLoading(false);
    }
  }

  logout() {
    this.authModel.logout();
    this.lightModel.stopListening();
    window.location.href = 'index.html';
  }

  showLightControl() {
    // Redireciona para a tela com histórico
    window.location.href = 'sistema-com-historico.html';
  }

  startLightMonitoring() {
    this.lightModel.listenToLightState((state) => {
      if (state !== null) {
        this.view.updateLightState(state);
      }
    });
  }

  async toggleLight() {
    this.view.showLoading(true);

    try {
      const currentState = await this.lightModel.getCurrentState();
      const newState = currentState === 'on' ? 'off' : 'on';

      await this.lightModel.setLightState(newState);
      this.view.updateLightState(newState);
    } catch (error) {
      this.view.showMessage(error.message, 'error');
    } finally {
      this.view.showLoading(false);
    }
  }
}

export default AppController;