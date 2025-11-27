import BaseFilter from './BaseFilter.js';


class ValidationFilter extends BaseFilter {
    async execute(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Dados inválidos');
        }

        if (!data.action) {
            throw new Error('Ação é obrigatória');
        }

        const validActions = ['toggle', 'setState', 'getState'];
        if (!validActions.includes(data.action)) {
            throw new Error(`Ação inválida: ${data.action}`);
        }

        if (data.action === 'setState' && !['on', 'off'].includes(data.state)) {
            throw new Error('Estado deve ser "on" ou "off"');
        }

        return await super.execute(data);
    }
}

export default ValidationFilter;