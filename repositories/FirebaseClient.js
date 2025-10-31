/**
 * FirebaseClient (Singleton por par baseUrl+deviceId)
 * Padroniza construção de URLs e requisições HTTP ao Firebase.
 */
class FirebaseClient {
  constructor(firebaseUrl, deviceId) {
    this.baseUrl = firebaseUrl;
    this.deviceId = deviceId;
  }

  // Mapa de instâncias por chave "baseUrl|deviceId"
  static #instances = new Map();

  /**
   * Retorna a instância singleton para o par (firebaseUrl, deviceId)
   * @param {string} firebaseUrl
   * @param {string} deviceId
   * @returns {FirebaseClient}
   */
  static getInstance(firebaseUrl, deviceId) {
    const key = `${firebaseUrl}|${deviceId}`;
    if (!FirebaseClient.#instances.has(key)) {
      FirebaseClient.#instances.set(key, new FirebaseClient(firebaseUrl, deviceId));
    }
    return FirebaseClient.#instances.get(key);
  }

  /**
   * Monta a URL do Firebase para um caminho específico
   * @param {string} path
   */
  buildUrl(path) {
    return `${this.baseUrl}/devices/${this.deviceId}/${path}.json`;
  }

  /**
   * Requisição HTTP genérica
   * @param {string} url
   * @param {object} options
   */
  async request(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error('Resposta JSON inválida do Firebase:', text);
      throw new Error('Resposta inválida do Firebase');
    }

    if (!response.ok) {
      const msg = (data && (data.error || data.message)) || `HTTP ${response.status}`;
      throw new Error(`Erro Firebase: ${msg}`);
    }

    return data;
  }
}

export default FirebaseClient;
