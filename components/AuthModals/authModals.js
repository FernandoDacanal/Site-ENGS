// Authentication Modals Module
(function () {
  'use strict';

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModals);
  } else {
    initAuthModals();
  }

  function initAuthModals() {
    injectAuthModals();
    injectFloatingTrigger();
    setupDropdownIntegrations();
  }

  // Inject the modal HTML structures into the body
  function injectAuthModals() {
    if (document.getElementById('auth-modals-container')) return;

    const container = document.createElement('div');
    container.id = 'auth-modals-container';
    
    container.innerHTML = `
      <!-- LOGIN MODAL -->
      <div id="modal-login" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('login')">&times;</button>
          <h3 class="auth-modal-title">Entrar na Conta</h3>
          <form id="form-login" onsubmit="event.preventDefault(); window.AuthModals.submitLogin();">
            <div class="auth-modal-group">
              <label class="auth-modal-label">E-mail</label>
              <input type="email" id="login-email" class="auth-modal-input" placeholder="seuemail@exemplo.com" required>
              <div class="auth-modal-error">Por favor, insira um e-mail válido.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">Senha</label>
              <input type="password" id="login-password" class="auth-modal-input" placeholder="Sua senha" required>
              <div class="auth-modal-error">A senha é obrigatória.</div>
            </div>
            <div style="text-align: right; margin-bottom: 15px;">
              <span class="auth-modal-link" onclick="window.AuthModals.switchModal('login', 'recover')">Esqueci minha senha</span>
            </div>
            <div class="auth-modal-actions">
              <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('login')">Cancelar</button>
              <button type="submit" class="auth-btn auth-btn-primary">Entrar</button>
            </div>
          </form>
          <div class="auth-modal-link-container">
            Não tem uma conta? <span class="auth-modal-link" onclick="window.AuthModals.switchModal('login', 'register')">Cadastre-se</span>
          </div>
        </div>
      </div>

      <!-- REGISTER MODAL -->
      <div id="modal-register" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('register')">&times;</button>
          <h3 class="auth-modal-title">Criar Conta</h3>
          <form id="form-register" onsubmit="event.preventDefault(); window.AuthModals.submitRegister();">
            <div class="auth-modal-group">
              <label class="auth-modal-label">Nome Completo</label>
              <input type="text" id="register-name" class="auth-modal-input" placeholder="Seu nome" required>
              <div class="auth-modal-error" id="err-register-name">Nome é obrigatório.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">E-mail</label>
              <input type="email" id="register-email" class="auth-modal-input" placeholder="seuemail@exemplo.com" required>
              <div class="auth-modal-error" id="err-register-email">Formato de e-mail inválido.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">Senha</label>
              <input type="password" id="register-password" class="auth-modal-input" placeholder="Mínimo 6 caracteres" required>
              <div class="auth-modal-error" id="err-register-password">A senha deve ter pelo menos 6 caracteres.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">Confirmar Senha</label>
              <input type="password" id="register-confirm-password" class="auth-modal-input" placeholder="Confirme sua senha" required>
              <div class="auth-modal-error" id="err-register-confirm">As senhas não coincidem.</div>
            </div>
            <div class="auth-modal-actions">
              <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('register')">Cancelar</button>
              <button type="submit" class="auth-btn auth-btn-primary">Cadastrar</button>
            </div>
          </form>
          <div class="auth-modal-link-container">
            Já tem uma conta? <span class="auth-modal-link" onclick="window.AuthModals.switchModal('register', 'login')">Entrar</span>
          </div>
        </div>
      </div>

      <!-- RECOVER PASSWORD MODAL -->
      <div id="modal-recover" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('recover')">&times;</button>
          <h3 class="auth-modal-title">Recuperar Senha</h3>
          
          <!-- State 1: Enter Email -->
          <div id="recover-step-email">
            <p class="text-muted text-center mb-4" style="font-size: 13px;">Insira o seu e-mail cadastrado para enviarmos um código de verificação.</p>
            <form id="form-recover-email" onsubmit="event.preventDefault(); window.AuthModals.sendVerificationCode();">
              <div class="auth-modal-group">
                <label class="auth-modal-label">E-mail</label>
                <input type="email" id="recover-email-input" class="auth-modal-input" placeholder="seuemail@exemplo.com" required>
                <div class="auth-modal-error">E-mail inválido.</div>
              </div>
              <div class="auth-modal-actions">
                <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('recover')">Cancelar</button>
                <button type="submit" class="auth-btn auth-btn-primary">Enviar Código</button>
              </div>
            </form>
          </div>

          <!-- State 2: Enter Code -->
          <div id="recover-step-code" style="display: none;">
            <p class="text-muted text-center mb-4" style="font-size: 13px;">Código enviado! Digite o código de 4 dígitos enviado ao seu e-mail (dica: digite <strong style="color:#a855f7">1234</strong>).</p>
            <form id="form-recover-code" onsubmit="event.preventDefault(); window.AuthModals.verifyCode();">
              <div class="auth-modal-group">
                <label class="auth-modal-label">Código de Verificação</label>
                <input type="text" id="recover-code-input" class="auth-modal-input" placeholder="Ex: 1234" maxlength="4" required>
                <div class="auth-modal-error" id="err-recover-code" style="display:none; color:#ef4444; font-size:12px; margin-top:5px;">Código incorreto.</div>
              </div>
              <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span class="auth-modal-link" onclick="window.AuthModals.resetRecoverFlow()" style="font-size: 12px;"><i class="mdi mdi-arrow-left"></i> Voltar</span>
                <span class="auth-modal-link" onclick="window.AuthModals.resendCode()" style="font-size: 12px;">Re-enviar código</span>
              </div>
              <div class="auth-modal-actions">
                <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('recover')">Cancelar</button>
                <button type="submit" class="auth-btn auth-btn-primary">Confirmar Código</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Bind overlay clicks to close modals (Fluxo Alternativo B)
    document.querySelectorAll('.auth-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          const type = overlay.id.replace('modal-', '');
          window.AuthModals.close(type);
        }
      });
    });
  }

  // Inject a floating access menu on the bottom left corner for test purposes
  function injectFloatingTrigger() {
    if (document.getElementById('auth-test-trigger')) return;

    const trigger = document.createElement('button');
    trigger.id = 'auth-test-trigger';
    trigger.className = 'auth-test-trigger';
    trigger.title = 'Testar Modais (Painel Dev)';
    trigger.innerHTML = '<i class="mdi mdi-account-circle"></i>';

    const menu = document.createElement('div');
    menu.id = 'auth-test-menu';
    menu.className = 'auth-test-menu';
    menu.innerHTML = `
      <button onclick="window.AuthModals.open('login')"><i class="mdi mdi-login"></i> Abrir Login</button>
      <button onclick="window.AuthModals.open('register')"><i class="mdi mdi-account-plus"></i> Abrir Cadastro</button>
      <button onclick="window.AuthModals.open('recover')"><i class="mdi mdi-key-variant"></i> Recuperar Senha</button>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(menu);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menu.style.display === 'flex';
      menu.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Integrate with navbar components if they exist
  function setupDropdownIntegrations() {
    const profileDropdown = document.querySelector('.navbar-dropdown[aria-labelledby="profileDropdown"]');
    if (profileDropdown) {
      // Create a "Gerenciar Conta" option in the existing dropdown
      const divItem = document.createElement('div');
      divItem.className = 'dropdown-divider';
      
      const aItem = document.createElement('a');
      aItem.className = 'dropdown-item';
      aItem.href = '#';
      aItem.innerHTML = '<i class="mdi mdi-shield-account me-2 text-info"></i> Gerenciar Conta';
      aItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.AuthModals.open('login');
      });

      // Insert before Signout
      const signoutBtn = profileDropdown.querySelector('.mdi-logout')?.parentElement;
      if (signoutBtn) {
        profileDropdown.insertBefore(divItem, signoutBtn);
        profileDropdown.insertBefore(aItem, signoutBtn);
      } else {
        profileDropdown.appendChild(divItem);
        profileDropdown.appendChild(aItem);
      }
    }
  }

  // Global actions for modals
  window.AuthModals = {
    open: function (type) {
      // Hide all modals first
      document.querySelectorAll('.auth-modal-overlay').forEach(el => el.classList.remove('active'));
      
      const modal = document.getElementById(`modal-${type}`);
      if (modal) {
        modal.classList.add('active');
        // Reset steps for recovery modal
        if (type === 'recover') {
          this.resetRecoverFlow();
        }
      }
    },

    close: function (type) {
      const modal = document.getElementById(`modal-${type}`);
      if (modal) {
        modal.classList.remove('active');
        // Clear all validation errors and inputs
        const form = modal.querySelector('form');
        if (form) form.reset();
        modal.querySelectorAll('.auth-modal-input').forEach(input => {
          input.classList.remove('is-invalid');
        });
      }
    },

    switchModal: function (from, to) {
      this.close(from);
      setTimeout(() => {
        this.open(to);
      }, 300);
    },

    // Submit actions & validations
    submitLogin: function () {
      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');
      let valid = true;

      // Basic validation
      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (valid) {
        this.close('login');
        if (window.showToastNotification) {
          window.showToastNotification(`Seja bem-vindo de volta! Logado como ${email.value}`);
        }
      }
    },

    submitRegister: function () {
      const name = document.getElementById('register-name');
      const email = document.getElementById('register-email');
      const pass = document.getElementById('register-password');
      const confirmPass = document.getElementById('register-confirm-password');
      let valid = true;

      if (!name.value.trim()) {
        name.classList.add('is-invalid');
        valid = false;
      } else {
        name.classList.remove('is-invalid');
      }

      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (pass.value !== confirmPass.value) {
        confirmPass.classList.add('is-invalid');
        valid = false;
      } else {
        confirmPass.classList.remove('is-invalid');
      }

      if (valid) {
        this.close('register');
        if (window.showToastNotification) {
          window.showToastNotification(`Conta criada com sucesso! Boas-vindas, ${name.value}!`);
        }
      }
    },

    // Password Recovery Flow
    sendVerificationCode: function () {
      const email = document.getElementById('recover-email-input');
      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        return;
      }
      email.classList.remove('is-invalid');

      // Go to code step
      document.getElementById('recover-step-email').style.display = 'none';
      document.getElementById('recover-step-code').style.display = 'block';

      if (window.showToastNotification) {
        window.showToastNotification(`Código de verificação enviado para ${email.value}`);
      }
    },

    verifyCode: function () {
      const codeInput = document.getElementById('recover-code-input');
      const errEl = document.getElementById('err-recover-code');

      if (codeInput.value === '1234') {
        codeInput.classList.remove('is-invalid');
        errEl.style.display = 'none';
        this.close('recover');
        if (window.showToastNotification) {
          window.showToastNotification("Código confirmado! Nova senha temporária enviada ao seu e-mail.");
        }
      } else {
        codeInput.classList.add('is-invalid');
        errEl.style.display = 'block';
      }
    },

    resendCode: function () {
      const emailVal = document.getElementById('recover-email-input').value;
      if (window.showToastNotification) {
        window.showToastNotification(`Novo código enviado para ${emailVal || 'seu e-mail'}`);
      }
      const codeInput = document.getElementById('recover-code-input');
      codeInput.value = '';
      codeInput.classList.remove('is-invalid');
      document.getElementById('err-recover-code').style.display = 'none';
    },

    resetRecoverFlow: function () {
      document.getElementById('recover-step-email').style.display = 'block';
      document.getElementById('recover-step-code').style.display = 'none';
      
      const codeInput = document.getElementById('recover-code-input');
      codeInput.value = '';
      codeInput.classList.remove('is-invalid');
      document.getElementById('err-recover-code').style.display = 'none';
      
      const emailInput = document.getElementById('recover-email-input');
      emailInput.classList.remove('is-invalid');
    }
  };
})();
