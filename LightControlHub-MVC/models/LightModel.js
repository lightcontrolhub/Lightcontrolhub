class LightModel {
  constructor(authModel) {
    this.firebaseUrl = 'https://teste-9142b-default-rtdb.firebaseio.com';
    this.deviceId = 'dispositivo-do-breno';
    this.authModel = authModel;
    this.pollInterval = null;
    this.currentCallback = null;
  }

  async setLightState(state) {
    try {
      // Atualiza config
      const configUrl = `${this.firebaseUrl}/devices/${this.deviceId}/config/led13Mode.json`;
      await fetch(configUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
      
      // Atualiza status
      const statusUrl = `${this.firebaseUrl}/devices/${this.deviceId}/status/led13Mode.json`;
      const statusValue = state === 'on' ? 'ligado' : 'desligado';
      await fetch(statusUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusValue)
      });
      
      console.log(`Estado da luz alterado para: ${state}`);
      return { success: true, state };
    } catch (error) {
      console.error("Erro ao alterar estado da luz:", error);
      throw new Error(`Falha ao alterar estado: ${error.message}`);
    }
  }

  // Método para escutar mudanças no estado da luz (polling)
  listenToLightState(callback) {
    this.currentCallback = callback;
    
    // Polling a cada 2 segundos
    this.pollInterval = setInterval(async () => {
      try {
        const state = await this.getCurrentState();
        callback(state);
      } catch (error) {
        console.error("Erro ao verificar estado:", error);
        callback(null, error);
      }
    }, 2000);
    
    // Primeira verificação imediata
    this.getCurrentState().then(callback).catch(error => callback(null, error));
  }

  // Método para parar de escutar mudanças
  stopListening() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.currentCallback = null;
  }

  // Método para validar estado
  isValidState(state) {
    return state === 'on' || state === 'off';
  }

  async getCurrentState() {
    try {
      const url = `${this.firebaseUrl}/devices/${this.deviceId}/config/led13Mode.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao conectar com Firebase');
      }
      
      const state = await response.json();
      return state || 'off';
    } catch (error) {
      console.error("Erro ao obter estado:", error);
      return 'off';
    }
  }
}

export default LightModel;