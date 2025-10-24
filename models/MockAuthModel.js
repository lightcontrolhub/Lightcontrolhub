class MockAuthModel {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
  }

  async login(email, password) {
    await this.delay(500);
    
    const user = this.users[email];
    if (!user || user.password !== password) {
      throw new Error('Email ou senha inválidos');
    }
    
    const token = 'mock_token_' + Date.now();
    this.token = token;
    this.user = { userId: user.id, email };
    
    localStorage.setItem('authToken', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));
    
    return {
      success: true,
      token,
      userId: user.id,
      email
    };
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
    await this.delay(300);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode', JSON.stringify({ email, code, expires: Date.now() + 300000 }));
    
    // Envia email real usando EmailJS
    try {
      await this.sendEmailWithEmailJS(email, code);
      return { 
        success: true, 
        message: `Código de verificação enviado para ${email}`
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { 
        success: true, 
        message: `Código de verificação: ${code} (Erro no envio de email)`,
        code // Fallback: mostra o código se email falhar
      };
    }
  }

  async sendEmailWithEmailJS(email, code) {
    // Carrega EmailJS se não estiver carregado
    if (!window.emailjs) {
      await this.loadEmailJS();
    }

    // Carrega configurações
    const { EMAIL_CONFIG } = await import('../email-config.js');

    // Inicializa EmailJS
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

    const templateParams = {
      to_email: email,
      verification_code: code,
      to_name: email.split('@')[0]
    };

    return emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams
    );
  }

  async loadEmailJS() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = resolve;
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

export default MockAuthModel;