import BaseFilter from './BaseFilter.js';

// Filtro de autenticação
class AuthFilter extends BaseFilter {
    constructor(component, authService) {
        super(component);
        this.authService = authService;
    }

    async execute(data) {
        if (!this.authService.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }

        return await super.execute(data);
    }
}

export default AuthFilter;