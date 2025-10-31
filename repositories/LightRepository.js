class LightRepository {
    constructor(firebaseUrl, deviceId) {
        this.baseUrl = firebaseUrl;
        this.deviceId = deviceId;
        this.dbRepository = new FirebaseRepository(firebaseUrl, deviceId);
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

}