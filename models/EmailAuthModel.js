class EmailAuthModel {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    
    // Configure EmailJS (substitua pelos seus IDs)
    this.emailjsConfig = {
      serviceId: 'service_xxxxxxx',  // Seu Service ID do EmailJS
      templateId: 'template_xxxxxxx', // Seu Template ID do EmailJS
      publicKey: 'xxxxxxxxxxxxxxx'    // Sua Public Key do EmailJS
    };
  }

  async login(email, password) {
    await this.delay(500);
    
    const user = this.users[email];
    if (!user || user.password !== password) {
      throw new Error('Email ou senha inválidos');
    }
    
    const token = 'token_' + Date.now();
    this.token = token;
    this.user = { userId: user.id, email };
    
    localStorage.setItem('authToken', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));
    
    return { success: true, token, userId: user.id, email };
  }

  async register(email, password) {
    await this.delay(500);
    
    if (this.users[email]) {
      throw new Error('Email já cadastrado');
    }
    
    const userId = 'user_' + Date.now();
    this.users[email] = { id: userId, password };
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
    
    return { success: true, message: 'Conta criada com sucesso' };
  }

  async sendVerificationCode(email) {
    try {
      // Usa a API backend para enviar código
      const response = await fetch('api/auth.php?action=send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success && data.debug && data.debug.code) {
        // Modo debug - mostra o código na tela
        return { 
          success: true, 
          message: data.message,
          code: data.debug.code,
          realEmail: false
        };
      }
      
      return { 
        success: true, 
        message: data.message || 'Código enviado',
        realEmail: true
      };
      
    } catch (error) {
      console.error('Erro na API:', error);
      
      // Fallback para sistema local
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('verificationCode', JSON.stringify({ 
        email, code, expires: Date.now() + 300000 
      }));
      
      return { 
        success: true, 
        message: `Fallback local. Código: ${code}`,
        code,
        realEmail: false
      };
    }
  }

  async loadEmailJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => {
        emailjs.init(this.emailjsConfig.publicKey);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async verifyCode(email, code) {
    await this.delay(300);
    
    try {
      // Usa a API backend para verificar o código
      const response = await fetch('api/auth.php?action=verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro na verificação');
      }
      
      // Remove código local se existir
      localStorage.removeItem('verificationCode');
      return { success: true, verified: true };
      
    } catch (error) {
      // Fallback para localStorage se API falhar
      const stored = JSON.parse(localStorage.getItem('verificationCode') || 'null');
      
      if (!stored || stored.email !== email || stored.expires < Date.now()) {
        throw new Error('Código expirado ou inválido');
      }
      
      if (stored.code !== code) {
        throw new Error('Código inválido');
      }
      
      localStorage.removeItem('verificationCode');
      return { success: true, verified: true };
    }
  }

  async verifyToken() {
    return !!this.token;
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

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default EmailAuthModel;