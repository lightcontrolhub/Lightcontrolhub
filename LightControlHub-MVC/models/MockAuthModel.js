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
    const code = '123456';
    localStorage.setItem('verificationCode', JSON.stringify({ email, code, expires: Date.now() + 300000 }));
    
    // Simula envio de email
    console.log(`📧 Email enviado para ${email} com código: ${code}`);
    
    return { 
      success: true, 
      message: `Código de verificação enviado para ${email}`, 
      code // Mostra o código para teste
    };
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