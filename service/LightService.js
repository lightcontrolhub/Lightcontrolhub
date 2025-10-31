import LightModel from "../models/LightModel";

class LightService {

    constructor() {
        this.dbRepository = new FirebaseRepository(
            LightModel.getFirebaseUrl(),
            LightModel.getDeviceId(),

        );
        this.lightRepository = new LightRepository(
            LightModel.getFirebaseUrl(),
            LightModel.getDeviceId(),
        );
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
                const state = await this.lightRepository.getCurrentState();
                callback(state);
            } catch (error) {
                console.error('Erro ao verificar estado:', error);
                callback(null, error);
            }
        }, this.POLL_INTERVAL_MS);

        // Immediate first check
        this.lightRepository.getCurrentState()
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
