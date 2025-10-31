/**
 * Firebase Repository
 * Handles all Firebase database operations for device management
 * Follows Repository Pattern to abstract data access layer
 */
class FirebaseRepository {
    constructor(firebaseUrl, deviceId) {
        this.baseUrl = firebaseUrl;
        this.deviceId = deviceId;
    }

    /**
     * Build Firebase URL for specific path
     * @param {string} path - The path to append to base URL
     * @returns {string} Complete Firebase URL
     */
    _buildUrl(path) {
        return `${this.baseUrl}/devices/${this.deviceId}/${path}.json`;
    }

    /**
     * Generic method to make HTTP requests to Firebase
     * @param {string} url - The URL to fetch
     * @param {object} options - Fetch options
     * @returns {Promise<any>} Response data
     */
    async _request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Firebase request error:', error);
            throw error;
        }
    }

    /**
     * Update device configuration
     * @param {string} path - Configuration path
     * @param {any} value - Value to set
     * @returns {Promise<any>} Response data
     */
    async updateConfig(path, value) {
        const url = this._buildUrl(`config/${path}`);
        return await this._request(url, {
            method: 'PUT',
            body: JSON.stringify(value)
        });
    }

    /**
     * Update device status
     * @param {string} path - Status path
     * @param {any} value - Value to set
     * @returns {Promise<any>} Response data
     */
    async updateStatus(path, value) {
        const url = this._buildUrl(`status/${path}`);
        return await this._request(url, {
            method: 'PUT',
            body: JSON.stringify(value)
        });
    }

    /**
     * Get device configuration
     * @param {string} path - Configuration path
     * @returns {Promise<any>} Configuration value
     */
    async getConfig(path) {
        const url = this._buildUrl(`config/${path}`);
        return await this._request(url);
    }

    /**
     * Get device status
     * @param {string} path - Status path
     * @returns {Promise<any>} Status value
     */
    async getStatus(path) {
        const url = this._buildUrl(`status/${path}`);
        return await this._request(url);
    }
}

export default FirebaseRepository;