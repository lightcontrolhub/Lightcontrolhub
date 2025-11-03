class AuthService {
    static #instance = null;

    static getInstance() {
        if (!AuthService.#instance) {
            AuthService.#instance = new AuthService();
        }
        return AuthService.#instance;
    }

    constructor() {
        if (AuthService.#instance) {
            throw new Error('Use AuthService.getInstance() instead of new AuthService()');
        }
        this.apiUrl = 'api/auth.php';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Resposta inválida:', text);
                throw new Error('Erro de comunicação com o servidor');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erro no login');
            }

            this.token = data.token;
            this.user = { userId: data.userId, email: data.email };

            localStorage.setItem('authToken', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async register(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}?action=register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Resposta inválida:', text);
                throw new Error('Erro de comunicação com o servidor');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Erro no cadastro');
            }

            return data;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    }

    async sendVerificationCode(email) {
        try {
            const response = await fetch(`${this.apiUrl}?action=send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const text = await response.text();
            console.log('API Response:', text);

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao enviar código');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    async verifyCode(email, code) {
        try {
            const response = await fetch(`${this.apiUrl}?action=verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Resposta inválida:', text);
                throw new Error('Erro de comunicação com o servidor');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Código inválido');
            }

            return data;
        } catch (error) {
            console.error('Erro na verificação:', error);
            throw error;
        }
    }

    async verifyToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${this.apiUrl}?action=verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: this.token })
            });

            return response.ok;
        } catch {
            return false;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

export default AuthService;