import LightOperation from './LightOperation.js';
import LogFilter from './LogFilter.js';
import ValidationFilter from './ValidationFilter.js';
import CacheFilter from './CacheFilter.js';
import AuthFilter from './AuthFilter.js';

// Factory para criar filtros
class FilterFactory {
    static createLightFilter(lightService, authService, options = {}) {
        let operation = new LightOperation(lightService);

        // Aplicar filtros na ordem desejada
        if (options.enableAuth && authService) {
            operation = new AuthFilter(operation, authService);
        }

        if (options.enableValidation !== false) {
            operation = new ValidationFilter(operation);
        }

        if (options.enableCache) {
            operation = new CacheFilter(operation, options.cacheTtl);
        }

        if (options.enableLog !== false) {
            operation = new LogFilter(operation);
        }

        return operation;
    }
}

export default FilterFactory;