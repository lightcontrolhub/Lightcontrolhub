class EmailAuthModel {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    
    // Configure EmailJS (substitua pelos seus IDs)
    this.emailjsConfig = {
      serviceId: 'YOUR_SERVICE_ID',
      templateId: 'YOUR_TEMPLATE_ID', 
      publicKey: 'YOUR_PUBLIC_KEY'
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode', JSON.stringify({ 
      email, code, expires: Date.now() + 300000 
    }));
    
    try {
      // Carrega EmailJS se não estiver carregado
      if (!window.emailjs) {
        await this.loadEmailJS();
      }
      
      // Envia email real
      await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        {
          to_email: email,
          verification_code: code,
          app_name: 'LightControlHub'
        },
        this.emailjsConfig.publicKey
      );
      
      return { 
        success: true, 
        message: `Código enviado para ${email}`,
        realEmail: true
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Fallback: mostra o código na tela
      return { 
        success: true, 
        message: `Erro no email. Código: ${code}`,
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
    const stored = JSON.parse(localStorage.getItem('verificationCode') || 'null');
    
    if (!stored || stored.email !== email || stored.expires < Date.now()) {
      throw new Error('Código expirado');
    }
    
    if (stored.code !== code) {
      throw new Error('Código inválido');
    }
    
    localStorage.removeItem('verificationCode');
    return { success: true, verified: true };
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