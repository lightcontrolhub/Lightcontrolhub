import LightModel from "../models/LightModel";

class LightService {

    constructor() {
        this.dbRepository = new FirebaseRepository(
            LightModel.getFirebaseUrl(),
            LightModel.getDeviceId(),
        );

    }

    /**
       * Set light state (on/off)
       * @param {string} state - 'on' or 'off'
       * @returns {Promise<object>} Result object
       */
    async setLightState(state) {
        if (!this.isValidState(state)) {
            throw new Error('Invalid state: must be "on" or "off"');
        }

        try {
            // Update config and status in parallel for better performance
            const statusValue = state === 'on' ? 'ligado' : 'desligado';

            await Promise.all([
                this.dbRepository.updateConfig(this.LED_PATH, state),
                this.dbRepository.updateStatus(this.LED_PATH, statusValue)
            ]);

            console.log(`Estado da luz alterado para:${state}`);
            return { success: true, state };
        } catch (error) {
            console.error('Erro ao alterar estado da luz:', error);
            throw new Error(`Falha ao alterar estado: ${error.message}`);
        }
    }

    /**
     * Get current light state
     * @returns {Promise<string>} Current state ('on' or 'off')
     */
    async getCurrentState() {
        try {
            const state = await this.dbRepository.getConfig(this.LED_PATH);
            return state || 'off';
        } catch (error) {
            console.error('Erro ao verificar estado:', error);
            return 'off';
        }
    }

    /**
     * Start listening to light state changes (polling)
     * @param {Function} callback - Callback function to receive state updates
     */
    listenToLightState(callback) {
        this.currentCallback = callback;

        // Poll every 2 seconds
        this.pollInterval = setInterval(async () => {
            try {
                const state = await this.getCurrentState();
                callback(state);
            } catch (error) {
                console.error('Erro ao verificar estado:', error);
                callback(null, error);
            }
        }, this.POLL_INTERVAL_MS);

        // Immediate first check
        this.getCurrentState()
            .then(callback)
            .catch(error => callback(null, error));
    }

    /**
     * Stop listening to state changes
     */
    stopListening() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        this.currentCallback = null;
    }

    /**
     * Validate light state
     * @param {string} state - State to validate
     * @returns {boolean} True if valid
     */
    isValidState(state) {
        return state === 'on' || state === 'off';
    }
}

export default LightService;
