class AuthView {
  constructor() {
    this.currentStep = 'login';
  }

  showLogin() {
    this.currentStep = 'login';
    document.body.innerHTML = `
      <div class="container">
        <div class="card">
          <h1 class="title">💡 LightControlHub</h1>
          <div id="message"></div>
          <form id="loginForm">
            <div class="form-group">
              <label>Email:</label>
              <input type="email" id="email" class="form-input" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label>Senha:</label>
              <input type="password" id="password" class="form-input" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary">Entrar</button>
            <button type="button" class="btn btn-secondary" id="showRegister">Criar Conta</button>
          </form>
        </div>
      </div>
    `;
  }

  showRegister() {
    this.currentStep = 'register';
    document.body.innerHTML = `
      <div class="container">
        <div class="card">
          <h1 class="title">Criar Conta</h1>
          <div id="message"></div>
          <form id="registerForm">
            <div class="form-group">
              <label>Email:</label>
              <input type="email" id="email" class="form-input" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label>Senha:</label>
              <input type="password" id="password" class="form-input" placeholder="••••••••" minlength="6" required>
            </div>
            <button type="submit" class="btn btn-primary">Criar Conta</button>
            <button type="button" class="btn btn-secondary" id="showLogin">Já tenho conta</button>
          </form>
        </div>
      </div>
    `;
  }

  showVerification(email) {
    this.currentStep = 'verification';
    document.body.innerHTML = `
      <div class="container">
        <div class="card">
          <h1 class="title">Verificação</h1>
          <div id="message"></div>
          <p class="text-center" style="margin-bottom: 2rem; opacity: 0.9;">
            Código enviado para:<br><strong>${email}</strong>
          </p>
          <form id="verificationForm">
            <div class="form-group">
              <label>Código de 6 dígitos:</label>
              <input type="text" id="code" class="form-input verification-input" 
                     placeholder="000000" maxlength="6" pattern="[0-9]{6}" required>
            </div>
            <button type="submit" class="btn btn-primary">Verificar</button>
            <button type="button" class="btn btn-secondary" id="resendCode">Reenviar Código</button>
          </form>
        </div>
      </div>
    `;
  }

  showLightControl(userEmail) {
    this.currentStep = 'control';
    document.body.innerHTML = `
      <div class="container">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1 class="title" style="margin: 0;">Minha Lâmpada</h1>
            <button id="logoutBtn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem; margin: 0;">Sair</button>
          </div>
          <p class="text-center" style="opacity: 0.8; margin-bottom: 2rem; font-size: 0.9rem;">${userEmail}</p>
          
          <div class="light-container">
            <div id="lightIcon" class="light-icon off">💡</div>
            <div id="statusText" class="status-text">Desligada</div>
            <button id="lightToggle" class="btn toggle-btn off">Ligar</button>
          </div>
          
          <div id="loadingSpinner" class="loading" style="display: none; margin: 1rem auto;"></div>
        </div>
      </div>
    `;
  }

  showMessage(message, type = 'error') {
    const messageEl = document.getElementById('message');
    if (messageEl) {
      messageEl.innerHTML = `<div class="message ${type}">${message}</div>`;
      setTimeout(() => messageEl.innerHTML = '', 5000);
    }
  }

  showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.display = show ? 'block' : 'none';
    }
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = show);
  }

  updateLightState(state) {
    const icon = document.getElementById('lightIcon');
    const status = document.getElementById('statusText');
    const toggle = document.getElementById('lightToggle');
    
    if (icon && status && toggle) {
      if (state === 'on') {
        icon.className = 'light-icon on';
        status.textContent = 'Ligada';
        toggle.textContent = 'Desligar';
        toggle.className = 'btn toggle-btn on';
      } else {
        icon.className = 'light-icon off';
        status.textContent = 'Desligada';
        toggle.textContent = 'Ligar';
        toggle.className = 'btn toggle-btn off';
      }
    }
  }

  onFormSubmit(callback) {
    document.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {};
      const inputs = e.target.querySelectorAll('input');
      inputs.forEach(input => {
        formData[input.id] = input.value;
      });
      callback(e.target.id, formData);
    });
  }

  onButtonClick(callback) {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' && e.target.id) {
        callback(e.target.id);
      }
    });
  }
}

export default AuthView;