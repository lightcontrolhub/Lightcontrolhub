import FilterFactory from './FilterFactory.js';
import LightService from '../service/LightService.js';
import AuthService from '../service/AuthService.js';

// Exemplo de uso dos filtros
async function exemploUso() {
    const lightService = new LightService();
    const authService = new AuthService();

    // Criar filtro com todas as funcionalidades
    const filteredOperation = FilterFactory.createLightFilter(
        lightService, 
        authService, 
        {
            enableAuth: true,
            enableValidation: true,
            enableCache: true,
            enableLog: true,
            cacheTtl: 3000
        }
    );

    try {
        // Ligar a luz
        await filteredOperation.execute({ action: 'setState', state: 'on' });
        
        // Verificar estado (vai usar cache)
        await filteredOperation.execute({ action: 'getState' });
        
        // Toggle
        await filteredOperation.execute({ action: 'toggle' });
        
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

export { exemploUso };