// Interface para Repository de Lâmpada com Histórico
class ILightRepository {
  
  // ===== OPERAÇÕES BÁSICAS =====
  
  /**
   * Salva o estado atual da lâmpada
   * @param {Object} light - Objeto lâmpada { id, state, timestamp, userId }
   * @returns {Promise<Object>} Resultado da operação
   */
  async save(light) {
    throw new Error('Method save() must be implemented');
  }
  
  /**
   * Busca lâmpada por ID
   * @param {string} lightId - ID da lâmpada
   * @returns {Promise<Object>} Dados da lâmpada
   */
  async findById(lightId) {
    throw new Error('Method findById() must be implemented');
  }
  
  /**
   * Obtém estado atual da lâmpada
   * @param {string} lightId - ID da lâmpada
   * @returns {Promise<string>} Estado atual ('on' ou 'off')
   */
  async getCurrentState(lightId) {
    throw new Error('Method getCurrentState() must be implemented');
  }
  
  // ===== OPERAÇÕES DE HISTÓRICO =====
  
  /**
   * Registra mudança de estado no histórico
   * @param {Object} change - { lightId, fromState, toState, timestamp, userId, duration }
   * @returns {Promise<string>} ID do registro criado
   */
  async logStateChange(change) {
    throw new Error('Method logStateChange() must be implemented');
  }
  
  /**
   * Busca histórico de mudanças
   * @param {string} lightId - ID da lâmpada
   * @param {Object} filters - { startDate, endDate, limit, offset }
   * @returns {Promise<Array>} Lista de mudanças
   */
  async getHistory(lightId, filters = {}) {
    throw new Error('Method getHistory() must be implemented');
  }
  
  /**
   * Busca últimas N mudanças
   * @param {string} lightId - ID da lâmpada  
   * @param {number} limit - Número máximo de registros
   * @returns {Promise<Array>} Lista das últimas mudanças
   */
  async getRecentChanges(lightId, limit = 10) {
    throw new Error('Method getRecentChanges() must be implemented');
  }
  
  /**
   * Calcula tempo total ligada em um período
   * @param {string} lightId - ID da lâmpada
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Promise<number>} Tempo em milissegundos
   */
  async getTotalOnTime(lightId, startDate, endDate) {
    throw new Error('Method getTotalOnTime() must be implemented');
  }
  
  /**
   * Busca estatísticas de uso
   * @param {string} lightId - ID da lâmpada
   * @param {string} period - 'day', 'week', 'month'
   * @returns {Promise<Object>} Estatísticas de uso
   */
  async getUsageStats(lightId, period = 'day') {
    throw new Error('Method getUsageStats() must be implemented');
  }
}

export default ILightRepository;