import FirebaseRepository from "../repositories/FirebaseRepository.js";

class LightService {
    /**
     * @param {string} firebaseUrl
     * @param {string} deviceId
     */
    constructor(firebaseUrl, deviceId) {
        this.dbRepository = new FirebaseRepository(firebaseUrl, deviceId);

        // Constantes de operação
        this.POLL_INTERVAL_MS = 2000;
        this.LED_PATH = 'led';

        // Estado interno
        this.pollInterval = null;
        this.currentCallback = null;
    }

    /**
     * Inicia o polling do estado da luz
     * @param {(state: string|null, error?: any) => void} callback
     */
    listenToLightState(callback) {
        this.currentCallback = callback;

        // Primeiro disparo imediato
        this.getCurrentState()
            .then(state => callback(state))
            .catch(error => callback(null, error));

        // Poll a cada 2s
        this.pollInterval = setInterval(async () => {
            try {
                const state = await this.getCurrentState();
                callback(state);
            } catch (error) {
                console.error('Erro ao verificar estado:', error);
                callback(null, error);
            }
        }, this.POLL_INTERVAL_MS);
    }

    /**
     * Para o polling do estado
     */
    stopListening() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        this.currentCallback = null;
    }

    /**
     * Retorna o estado atual (on/off)
     */
    async getCurrentState() {
        try {
            const state = await this.dbRepository.getConfig(this.LED_PATH);
            return state || 'off';
        } catch (error) {
            console.error('Erro ao obter estado atual:', error);
            return 'off';
        }
    }

    /**
     * Define o estado da luz (on/off)
     * @param {string} state
     */
    async setLightState(state) {
        if (!this.isValidState(state)) {
            throw new Error('Invalid state: must be "on" or "off"');
        }

        try {
            const statusValue = state === 'on' ? 'ligado' : 'desligado';
            await Promise.all([
                this.dbRepository.updateConfig(this.LED_PATH, state),
                this.dbRepository.updateStatus(this.LED_PATH, statusValue)
            ]);
            return { success: true, state };
        } catch (error) {
            console.error('Erro ao alterar estado da luz:', error);
            throw new Error(`Falha ao alterar estado: ${error.message}`);
        }
    }

    /**
     * Validação do estado
     * @param {string} state
     */
    isValidState(state) {
        return state === 'on' || state === 'off';
    }
}

export default LightService;
