import BaseFilter from './BaseFilter.js';

// Filtro de log
class LogFilter extends BaseFilter {
    async execute(data) {
        console.log(`[LOG] Executando: ${data.action}`, data);
        
        try {
            const result = await super.execute(data);
            console.log(`[LOG] Sucesso:`, result);
            return result;
        } catch (error) {
            console.error(`[LOG] Erro:`, error);
            throw error;
        }
    }
}

export default LogFilter;