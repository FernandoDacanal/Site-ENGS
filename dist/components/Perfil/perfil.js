// Perfil & Configurações da Conta Module (UC08, UC09, UC10, UC11, UC12)
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerfilModule);
  } else {
    initPerfilModule();
  }

  function initPerfilModule() {
    if (!document.getElementById('perfil-page-container')) return;

    loadUserData();
    setupChangeDataForm();
    setupDocsForm();
    setupScientistApplication();
    setupDeleteAccount();
    injectDeleteConfirmModal();
  }

  function loadUserData() {
    const user = window.NoteGStore ? window.NoteGStore.getUser() : null;
    if (!user) return;

    const nameInput = document.getElementById('user-name-input');
    const emailInput = document.getElementById('user-email-input');

    if (nameInput) nameInput.value = user.nome || '';
    if (emailInput) emailInput.value = user.email || '';
  }

  // UC09: Alterar Dados
  function setupChangeDataForm() {
    const form = document.getElementById('form-alterar-dados');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-name-input').value.trim();
      const email = document.getElementById('user-email-input').value.trim();
      const newPass = document.getElementById('user-new-pass').value;
      const confirmPass = document.getElementById('user-confirm-pass').value;

      // CA01: Falta de dados / incorretos
      if (!name || !email || !email.includes('@')) {
        if (window.showToastNotification) {
          window.showToastNotification("Por favor, preencha nome e e-mail válidos.", "error");
        }
        return;
      }

      if (newPass && newPass !== confirmPass) {
        if (window.showToastNotification) {
          window.showToastNotification("As senhas não coincidem.", "error");
        }
        return;
      }

      if (window.NoteGStore) {
        window.NoteGStore.setUser({
          nome: name,
          email: email
        });
      }

      document.getElementById('user-new-pass').value = '';
      document.getElementById('user-confirm-pass').value = '';

      if (window.showToastNotification) {
        window.showToastNotification("Dados pessoais atualizados com sucesso!");
      }
    });
  }

  // UC10: Atualizar Documentação
  function setupDocsForm() {
    const form = document.getElementById('form-atualizar-docs');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cpf = document.getElementById('doc-cpf-input').value.trim();
      const endereco = document.getElementById('doc-endereco-input').value.trim();
      const fileRg = document.getElementById('doc-file-rg').files[0];

      if (!cpf || !endereco) {
        if (window.showToastNotification) {
          window.showToastNotification("Preencha CPF e Endereço para validação cadastral.", "error");
        }
        return;
      }

      const statusEl = document.getElementById('rg-upload-status');
      if (fileRg && statusEl) {
        statusEl.innerHTML = `<i class="mdi mdi-check-circle"></i> Último envio: ${fileRg.name}`;
      }

      if (window.showToastNotification) {
        window.showToastNotification("Documentação enviada para análise com sucesso!");
      }
    });
  }

  // UC11: Candidatura ao Perfil Cientista
  function setupScientistApplication() {
    const form = document.getElementById('form-aplicar-cientista');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const lattes = document.getElementById('scientist-lattes').value.trim();
      const area = document.getElementById('scientist-area').value;
      const decl = document.getElementById('scientist-declaration').checked;

      // CA06.1: Documentação/Dados ausentes
      if (!lattes || !area || !decl) {
        const alertEl = document.getElementById('scientist-alert');
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.innerText = "Atenção: Insira o link do currículo, selecione a área e marque a declaração de veracidade.";
        }
        if (window.showToastNotification) {
          window.showToastNotification("Preencha todos os campos e marque a declaração.", "error");
        }
        return;
      }

      const alertEl = document.getElementById('scientist-alert');
      if (alertEl) alertEl.style.display = 'none';

      // Upgrade role to Cientista
      if (window.NoteGStore) {
        window.NoteGStore.setRole('cientista');
      }

      if (window.showToastNotification) {
        window.showToastNotification("Candidatura enviada e perfil de Cientista ativado!");
      }
    });
  }

  // UC12: Excluir Conta
  function setupDeleteAccount() {
    const chk = document.getElementById('chk-delete-confirm');
    const btn = document.getElementById('btn-delete-account');

    if (!chk || !btn) return;

    chk.addEventListener('change', () => {
      btn.disabled = !chk.checked;
    });

    btn.addEventListener('click', () => {
      window.PerfilModule.openDeleteModal();
    });
  }

  function injectDeleteConfirmModal() {
    if (document.getElementById('delete-account-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'delete-account-modal';
    modal.className = 'admin-confirm-overlay';
    modal.innerHTML = `
      <div class="admin-confirm-card">
        <h4 class="admin-confirm-title text-danger"><i class="mdi mdi-alert-circle me-1"></i> Confirmar Exclusão</h4>
        <p class="admin-confirm-message">
          Tem certeza absoluta que deseja excluir sua conta permanentemente? Esta operação é irreversível e todos os seus artigos salvos e histórico serão excluídos.
        </p>
        <div class="admin-confirm-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.PerfilModule.closeDeleteModal()">Cancelar</button>
          <button class="btn btn-gradient-danger" onclick="window.PerfilModule.confirmDeleteAccount()">Sim, Excluir Minha Conta</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.PerfilModule.closeDeleteModal();
      }
    });
  }

  window.PerfilModule = {
    openDeleteModal: function () {
      const modal = document.getElementById('delete-account-modal');
      if (modal) modal.classList.add('active');
    },

    closeDeleteModal: function () {
      const modal = document.getElementById('delete-account-modal');
      if (modal) modal.classList.remove('active');
    },

    confirmDeleteAccount: function () {
      if (window.NoteGStore) {
        window.NoteGStore.logout();
      }
      this.closeDeleteModal();

      if (window.showToastNotification) {
        window.showToastNotification("Sua conta foi excluída permanentemente.");
      }

      setTimeout(() => {
        const isSubpage = window.location.pathname.includes('/pages/');
        const basePath = isSubpage ? '../../' : './';
        window.location.href = `${basePath}index.html`;
      }, 1000);
    }
  };
})();
