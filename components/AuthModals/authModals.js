// Authentication & Account Management Modals Module (UC03, UC04, UC05, UC06, UC07)
(function () {
  'use strict';

  // Base path helper
  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '../../' : './';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModals);
  } else {
    initAuthModals();
  }

  function initAuthModals() {
    injectAuthModals();
    injectFloatingTrigger();
    setupNavbarUserDropdown();

    // Listen to store user changes
    window.addEventListener('noteg_user_changed', () => {
      setupNavbarUserDropdown();
    });
  }

  function injectAuthModals() {
    if (document.getElementById('auth-modals-container')) return;

    const container = document.createElement('div');
    container.id = 'auth-modals-container';

    container.innerHTML = `
      <!-- LOGIN MODAL (UC05) -->
      <div id="modal-login" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('login')">&times;</button>
          <h3 class="auth-modal-title">Entrar na Conta</h3>
          
          <div id="login-error-alert" style="display:none; padding:10px 14px; background:#fee2e2; border:1px solid #f87171; color:#b91c1c; border-radius:6px; font-size:13px; margin-bottom:15px;">
            E-mail ou senha incorretos. Tente novamente.
          </div>

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

      <!-- REGISTER MODAL (UC04) -->
      <div id="modal-register" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('register')">&times;</button>
          <h3 class="auth-modal-title">Criar Conta</h3>
          <form id="form-register" onsubmit="event.preventDefault(); window.AuthModals.submitRegister();">
            <div class="auth-modal-group">
              <label class="auth-modal-label">Nome Completo</label>
              <input type="text" id="register-name" class="auth-modal-input" placeholder="Seu nome" maxlength="100" required>
              <div class="auth-modal-error" id="err-register-name">Nome é obrigatório.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">E-mail</label>
              <input type="email" id="register-email" class="auth-modal-input" placeholder="seuemail@exemplo.com" maxlength="100" required>
              <div class="auth-modal-error" id="err-register-email">Formato de e-mail inválido.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">Senha</label>
              <input type="password" id="register-password" class="auth-modal-input" placeholder="Mínimo 6 caracteres" maxlength="20" required>
              <div class="auth-modal-error" id="err-register-password">A senha deve ter entre 6 e 20 caracteres.</div>
            </div>
            <div class="auth-modal-group">
              <label class="auth-modal-label">Confirmar Senha</label>
              <input type="password" id="register-confirm-password" class="auth-modal-input" placeholder="Confirme sua senha" maxlength="20" required>
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

      <!-- RECOVER PASSWORD MODAL (UC07) -->
      <div id="modal-recover" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('recover')">&times;</button>
          <h3 class="auth-modal-title">Recuperar Senha</h3>
          
          <!-- Step 1: Input Email -->
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

          <!-- Step 2: Code Verification -->
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
                <span class="auth-modal-link" onclick="window.AuthModals.resendCode()" style="font-size: 12px;">Reenviar código</span>
              </div>
              <div class="auth-modal-actions">
                <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('recover')">Cancelar</button>
                <button type="submit" class="auth-btn auth-btn-primary">Confirmar Código</button>
              </div>
            </form>
          </div>

          <!-- Step 3: New Password -->
          <div id="recover-step-password" style="display: none;">
            <p class="text-muted text-center mb-4" style="font-size: 13px;">Defina sua nova senha de acesso.</p>
            <form id="form-recover-password" onsubmit="event.preventDefault(); window.AuthModals.submitNewPassword();">
              <div class="auth-modal-group">
                <label class="auth-modal-label">Nova Senha</label>
                <input type="password" id="recover-new-password" class="auth-modal-input" placeholder="Nova senha (min. 6 caracteres)" required>
              </div>
              <div class="auth-modal-group">
                <label class="auth-modal-label">Confirmar Nova Senha</label>
                <input type="password" id="recover-confirm-password" class="auth-modal-input" placeholder="Repita a nova senha" required>
                <div class="auth-modal-error" id="err-recover-pass-match" style="display:none; color:#ef4444; font-size:12px; margin-top:5px;">Senhas não coincidem.</div>
              </div>
              <div class="auth-modal-actions">
                <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('recover')">Cancelar</button>
                <button type="submit" class="auth-btn auth-btn-primary">Salvar Nova Senha</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- LOGOUT CONFIRMATION MODAL (UC06) -->
      <div id="modal-logout" class="auth-modal-overlay">
        <div class="auth-modal-card">
          <button class="auth-modal-close" onclick="window.AuthModals.close('logout')">&times;</button>
          <h3 class="auth-modal-title">Sair da Conta</h3>
          <p class="text-muted text-center mb-4" style="font-size: 13.5px;">Deseja realmente desconectar da sua sessão atual?</p>
          <div class="auth-modal-actions">
            <button type="button" class="auth-btn auth-btn-secondary" onclick="window.AuthModals.close('logout')">Cancelar</button>
            <button type="button" class="auth-btn auth-btn-danger" onclick="window.AuthModals.confirmLogout()">Sair da Conta</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Close on backdrop click (CA03)
    document.querySelectorAll('.auth-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          const type = overlay.id.replace('modal-', '');
          window.AuthModals.close(type);
        }
      });
    });
  }

  // Navbar user dropdown (UC03) and Role switcher
  function setupNavbarUserDropdown() {
    const profileItem = document.querySelector('.navbar-nav-right .nav-profile');
    if (!profileItem) return;

    const user = window.NoteGStore ? window.NoteGStore.getUser() : { role: 'cientista', nome: 'Elsa Larson' };
    const isGuest = user.role === 'visitante';

    if (isGuest) {
      // Guest state (Visitante)
      profileItem.innerHTML = `
        <a class="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" style="display:flex; align-items:center;">
          <div class="nav-profile-img">
            <span class="mdi mdi-account-circle" style="font-size: 32px; color: #a855f7;"></span>
          </div>
          <div class="nav-profile-text ms-2">
            <p class="mb-0 text-black font-weight-bold">Visitante</p>
            <span class="badge badge-outline-secondary" style="font-size:10px; padding:2px 5px;">Desconectado</span>
          </div>
        </a>
        <div class="dropdown-menu navbar-dropdown dropdown-menu-end" aria-labelledby="profileDropdown">
          <a class="dropdown-item" href="#" onclick="window.AuthModals.open('login'); return false;">
            <i class="mdi mdi-login me-2 text-primary"></i> Abrir Login
          </a>
          <a class="dropdown-item" href="#" onclick="window.AuthModals.open('register'); return false;">
            <i class="mdi mdi-account-plus me-2 text-success"></i> Abrir Cadastro
          </a>
          <a class="dropdown-item" href="#" onclick="window.AuthModals.open('recover'); return false;">
            <i class="mdi mdi-key-variant me-2 text-warning"></i> Recuperar Senha
          </a>
          <div class="dropdown-divider"></div>
          <h6 class="dropdown-header text-muted font-weight-bold" style="font-size:11px;">MUDAR PERFIL (TESTES)</h6>
          <a class="dropdown-item" href="#" onclick="window.AuthModals.switchRole('nao-cientista'); return false;">
            <i class="mdi mdi-account me-2 text-info"></i> Usuário Comum
          </a>
          <a class="dropdown-item" href="#" onclick="window.AuthModals.switchRole('cientista'); return false;">
            <i class="mdi mdi-school me-2 text-purple" style="color:#a855f7;"></i> Usuário Cientista
          </a>
          <a class="dropdown-item" href="#" onclick="window.AuthModals.switchRole('admin'); return false;">
            <i class="mdi mdi-shield-account me-2 text-danger"></i> Administrador
          </a>
        </div>
      `;
    } else {
      // Logged in user
      const avatarSrc = basePath + (user.avatar || 'assets/images/faces/face10.jpg');
      profileItem.innerHTML = `
        <a class="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" style="display:flex; align-items:center;">
          <div class="nav-profile-img">
            <img src="${avatarSrc}" alt="${user.nome}">
            <span class="availability-status online"></span>
          </div>
          <div class="nav-profile-text ms-2">
            <p class="mb-0 text-black font-weight-bold">${user.nome}</p>
            <span class="badge ${user.role === 'admin' ? 'badge-gradient-danger' : user.role === 'cientista' ? 'badge-gradient-primary' : 'badge-gradient-info'}" style="font-size:10px; padding:2px 6px;">
              ${user.roleLabel || 'Usuário'}
            </span>
          </div>
        </a>
        <div class="dropdown-menu navbar-dropdown dropdown-menu-end" aria-labelledby="profileDropdown">
          <a class="dropdown-item" href="${basePath}pages/conta/perfil.html">
            <i class="mdi mdi-account-cog me-2 text-primary"></i> Gerenciar Conta
          </a>
          <div class="dropdown-divider"></div>
          <h6 class="dropdown-header text-muted font-weight-bold" style="font-size:11px;">SIMULAR PAPEL</h6>
          <a class="dropdown-item ${user.role === 'cientista' ? 'active font-weight-bold' : ''}" href="#" onclick="window.AuthModals.switchRole('cientista'); return false;">
            <i class="mdi mdi-school me-2" style="color:#a855f7;"></i> Cientista
          </a>
          <a class="dropdown-item ${user.role === 'nao-cientista' ? 'active font-weight-bold' : ''}" href="#" onclick="window.AuthModals.switchRole('nao-cientista'); return false;">
            <i class="mdi mdi-account me-2 text-info"></i> Não Cientista (Comum)
          </a>
          <a class="dropdown-item ${user.role === 'admin' ? 'active font-weight-bold' : ''}" href="#" onclick="window.AuthModals.switchRole('admin'); return false;">
            <i class="mdi mdi-shield-account me-2 text-danger"></i> Administrador
          </a>
          <a class="dropdown-item ${user.role === 'visitante' ? 'active font-weight-bold' : ''}" href="#" onclick="window.AuthModals.switchRole('visitante'); return false;">
            <i class="mdi mdi-incognito me-2 text-muted"></i> Visitante
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item text-danger" href="#" onclick="window.AuthModals.open('logout'); return false;">
            <i class="mdi mdi-logout me-2 text-danger"></i> Sair da Conta
          </a>
        </div>
      `;
    }
  }

  // Floating trigger menu for quick prototype validation
  function injectFloatingTrigger() {
    if (document.getElementById('auth-test-trigger')) return;

    const trigger = document.createElement('button');
    trigger.id = 'auth-test-trigger';
    trigger.className = 'auth-test-trigger';
    trigger.title = 'Acesso Rápido a Modais e Perfis';
    trigger.innerHTML = '<i class="mdi mdi-account-switch"></i>';

    const menu = document.createElement('div');
    menu.id = 'auth-test-menu';
    menu.className = 'auth-test-menu';
    menu.innerHTML = `
      <div style="font-size:11px; font-weight:bold; color:#a855f7; margin-bottom:5px; text-transform:uppercase;">Modais Note G#</div>
      <button onclick="window.AuthModals.open('login')"><i class="mdi mdi-login"></i> Abrir Login (UC05)</button>
      <button onclick="window.AuthModals.open('register')"><i class="mdi mdi-account-plus"></i> Abrir Cadastro (UC04)</button>
      <button onclick="window.AuthModals.open('recover')"><i class="mdi mdi-key-variant"></i> Recuperar Senha (UC07)</button>
      <button onclick="window.AuthModals.open('logout')"><i class="mdi mdi-logout"></i> Sair da Conta (UC06)</button>
      <div style="font-size:11px; font-weight:bold; color:#a855f7; margin:8px 0 5px 0; text-transform:uppercase;">Alternar Papel</div>
      <button onclick="window.AuthModals.switchRole('cientista')"><i class="mdi mdi-school"></i> Usuário Cientista</button>
      <button onclick="window.AuthModals.switchRole('nao-cientista')"><i class="mdi mdi-account"></i> Não Cientista</button>
      <button onclick="window.AuthModals.switchRole('admin')"><i class="mdi mdi-shield-account"></i> Administrador</button>
      <button onclick="window.AuthModals.switchRole('visitante')"><i class="mdi mdi-incognito"></i> Visitante</button>
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

  // Global methods
  window.AuthModals = {
    open: function (type) {
      document.querySelectorAll('.auth-modal-overlay').forEach(el => el.classList.remove('active'));
      const modal = document.getElementById(`modal-${type}`);
      if (modal) {
        modal.classList.add('active');
        if (type === 'recover') {
          this.resetRecoverFlow();
        }
        if (type === 'login') {
          const errBox = document.getElementById('login-error-alert');
          if (errBox) errBox.style.display = 'none';
        }
      }
    },

    close: function (type) {
      const modal = document.getElementById(`modal-${type}`);
      if (modal) {
        modal.classList.remove('active');
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
      }, 250);
    },

    submitLogin: function () {
      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');
      const errBox = document.getElementById('login-error-alert');
      let valid = true;

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

      if (!valid) return;

      // Simulate check (accepts any email, but if pass === 'errada' simulates CA01)
      if (pass.value.toLowerCase() === 'errada') {
        if (errBox) errBox.style.display = 'block';
        return;
      }

      if (window.NoteGStore) {
        window.NoteGStore.setUser({
          email: email.value,
          nome: email.value.split('@')[0],
          role: 'cientista'
        });
      }

      this.close('login');
      if (window.showToastNotification) {
        window.showToastNotification(`Seja bem-vindo de volta! Sessão iniciada.`);
      }
      setupNavbarUserDropdown();
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

      if (!valid) return;

      if (window.NoteGStore) {
        window.NoteGStore.setUser({
          nome: name.value.trim(),
          email: email.value.trim(),
          role: 'nao-cientista',
          roleLabel: 'Usuário Comum'
        });
      }

      this.close('register');
      if (window.showToastNotification) {
        window.showToastNotification(`Conta criada com sucesso! Boas-vindas ao Note G#, ${name.value}!`);
      }
      setupNavbarUserDropdown();
    },

    sendVerificationCode: function () {
      const email = document.getElementById('recover-email-input');
      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        return;
      }
      email.classList.remove('is-invalid');

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
        
        // Go to new password step
        document.getElementById('recover-step-code').style.display = 'none';
        document.getElementById('recover-step-password').style.display = 'block';
      } else {
        codeInput.classList.add('is-invalid');
        errEl.style.display = 'block';
      }
    },

    submitNewPassword: function () {
      const newPass = document.getElementById('recover-new-password');
      const confirmPass = document.getElementById('recover-confirm-password');
      const errEl = document.getElementById('err-recover-pass-match');

      if (!newPass.value || newPass.value.length < 6) {
        newPass.classList.add('is-invalid');
        return;
      }
      newPass.classList.remove('is-invalid');

      if (newPass.value !== confirmPass.value) {
        confirmPass.classList.add('is-invalid');
        errEl.style.display = 'block';
        return;
      }
      confirmPass.classList.remove('is-invalid');
      errEl.style.display = 'none';

      this.close('recover');
      if (window.showToastNotification) {
        window.showToastNotification("Senha alterada com sucesso! Você já pode entrar.");
      }
      setTimeout(() => this.open('login'), 300);
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
      document.getElementById('recover-step-password').style.display = 'none';
      
      const codeInput = document.getElementById('recover-code-input');
      if (codeInput) {
        codeInput.value = '';
        codeInput.classList.remove('is-invalid');
      }
      const errEl = document.getElementById('err-recover-code');
      if (errEl) errEl.style.display = 'none';
      
      const emailInput = document.getElementById('recover-email-input');
      if (emailInput) emailInput.classList.remove('is-invalid');
    },

    confirmLogout: function () {
      if (window.NoteGStore) {
        window.NoteGStore.logout();
      }
      this.close('logout');
      if (window.showToastNotification) {
        window.showToastNotification("Você saiu da sua conta.");
      }
      setupNavbarUserDropdown();
    },

    switchRole: function (role) {
      if (window.NoteGStore) {
        window.NoteGStore.setRole(role);
      }
      if (window.showToastNotification) {
        const labels = {
          'visitante': 'Visitante',
          'nao-cientista': 'Usuário Comum (Não Cientista)',
          'cientista': 'Usuário Cientista',
          'admin': 'Administrador'
        };
        window.showToastNotification(`Papel alterado para: ${labels[role] || role}`);
      }
      setupNavbarUserDropdown();
    }
  };
})();
