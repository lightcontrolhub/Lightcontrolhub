import AppController from '../../controllers/AppController.js';

class App {
  constructor() {
    this.appController = null;
  }

  async init() {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.start());
      } else {
        this.start();
      }
    } catch (error) {
      console.error('Erro ao inicializar:', error);
    }
  }

  start() {
    this.appController = new AppController();
    console.log('LightControlHub iniciado!');
  }
}

const app = new App();
app.init();