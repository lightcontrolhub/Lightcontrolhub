import LightModel from '../models/LightModel.js';
import FirebaseRepository from '../repositories/FirebaseRepository.js';
import LightRepository from '../repositories/LightRepository.js';

class LightService {
    static #instance = null;

    static getInstance(firebaseUrl, deviceId) {
        if (!LightService.#instance) {
            LightService.#instance = new LightService(firebaseUrl, deviceId);
        }
        return LightService.#instance;
    }

    constructor(firebaseUrl, deviceId) {
        if (LightService.#instance) {
            throw new Error('Use LightService.getInstance() instead of new LightService()');
        }
        this.firebaseUrl = firebaseUrl || 'https://teste-9142b-default-rtdb.firebaseio.com';
        this.deviceId = deviceId || 'dispositivo-do-breno';
        this.POLL_INTERVAL_MS = 2000;
        
        this.dbRepository = FirebaseRepository.getInstance(
            this.firebaseUrl,
            this.deviceId
        );
        this.lightRepository = LightRepository.getInstance(
            this.firebaseUrl,
            this.deviceId
        );
    }

    /**
     * Set light state
     * @param {string} state - 'on' or 'off'
     * @returns {Promise<object>} Result object
     */
    async setLightState(state) {
        return await this.lightRepository.setLightState(state);
    }

    /**
     * Get current light state
     * @returns {Promise<string>} Current state
     */
    async getCurrentState() {
        return await this.lightRepository.getCurrentState();
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
