// Admin Moderation Module (UC25, UC26, UC27, UC28, UC29)
(function () {
  'use strict';

  let pendingAction = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
  } else {
    initAdminPanel();
  }

  function initAdminPanel() {
    if (!document.getElementById('reports-table-body')) return;

    setupTabs();
    renderTables();
    injectConfirmModal();
  }

  function setupTabs() {
    const tabBtns = document.querySelectorAll('.moderation-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  function renderTables() {
    const denuncias = window.NoteGStore ? window.NoteGStore.getDenuncias() : [];
    const banidos = window.NoteGStore ? window.NoteGStore.getBanidos() : [];

    // 1. Render Reports Table (UC25)
    const reportsBody = document.getElementById('reports-table-body');
    if (reportsBody) {
      if (denuncias.length === 0) {
        reportsBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center py-4 text-muted">
              <i class="mdi mdi-checkbox-marked-circle-outline text-success me-2"></i>Nenhuma denúncia pendente no momento.
            </td>
          </tr>
        `;
      } else {
        reportsBody.innerHTML = denuncias.map(d => `
          <tr>
            <td><strong>${d.titulo}</strong></td>
            <td><i class="mdi mdi-account-circle me-1 text-muted"></i>${d.autor}</td>
            <td><span class="badge-reason">${d.motivo}</span></td>
            <td><span class="badge-date">${d.data}</span></td>
            <td>
              <button class="btn btn-sm btn-gradient-danger me-2" onclick="window.AdminPanel.confirmBan(${d.id})">
                <i class="mdi mdi-account-off"></i> Banir
              </button>
              <button class="btn btn-sm btn-outline-secondary" onclick="window.AdminPanel.confirmReject(${d.id})">
                Rejeitar
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // 2. Render Banned Users Table (UC28)
    const bannedBody = document.getElementById('banned-table-body');
    if (bannedBody) {
      if (banidos.length === 0) {
        bannedBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center py-4 text-muted">Nenhum usuário banido no momento.</td>
          </tr>
        `;
      } else {
        bannedBody.innerHTML = banidos.map(b => `
          <tr>
            <td>#${b.id}</td>
            <td><strong>${b.nome}</strong></td>
            <td>${b.email}</td>
            <td><span class="badge-date">${b.dataBan}</span></td>
            <td>
              <button class="btn btn-sm btn-gradient-success" onclick="window.AdminPanel.confirmUnban(${b.id})">
                <i class="mdi mdi-account-check"></i> Desbanir
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  function injectConfirmModal() {
    if (document.getElementById('admin-confirm-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'admin-confirm-modal';
    modal.className = 'admin-confirm-overlay';
    modal.innerHTML = `
      <div class="admin-confirm-card">
        <h4 class="admin-confirm-title" id="admin-confirm-title">Confirmar Ação</h4>
        <p class="admin-confirm-message" id="admin-confirm-message">Você tem certeza que deseja prosseguir?</p>
        <div class="admin-confirm-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.AdminPanel.closeConfirm()">Cancelar</button>
          <button class="btn btn-gradient-danger" id="admin-confirm-yes-btn">Confirmar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.AdminPanel.closeConfirm();
      }
    });
  }

  window.AdminPanel = {
    // UC26: Banir Usuário
    confirmBan: function (denunciaId) {
      const denuncias = window.NoteGStore ? window.NoteGStore.getDenuncias() : [];
      const den = denuncias.find(d => d.id === denunciaId);
      if (!den) return;

      pendingAction = {
        type: 'ban',
        id: denunciaId,
        autor: den.autor
      };

      document.getElementById('admin-confirm-title').innerText = "Banir Usuário";
      document.getElementById('admin-confirm-message').innerText = `Tem certeza que deseja banir o autor deste artigo ("${den.autor}")?`;
      
      const yesBtn = document.getElementById('admin-confirm-yes-btn');
      yesBtn.className = "btn btn-gradient-danger";
      yesBtn.onclick = () => this.executeAction();

      document.getElementById('admin-confirm-modal').classList.add('active');
    },

    // UC27: Rejeitar Denúncia
    confirmReject: function (denunciaId) {
      const denuncias = window.NoteGStore ? window.NoteGStore.getDenuncias() : [];
      const den = denuncias.find(d => d.id === denunciaId);
      if (!den) return;

      pendingAction = {
        type: 'reject',
        id: denunciaId,
        titulo: den.titulo
      };

      document.getElementById('admin-confirm-title').innerText = "Rejeitar Denúncia";
      document.getElementById('admin-confirm-message').innerText = `Tem certeza que deseja rejeitar a denúncia sobre o artigo "${den.titulo}"?`;
      
      const yesBtn = document.getElementById('admin-confirm-yes-btn');
      yesBtn.className = "btn btn-gradient-warning";
      yesBtn.onclick = () => this.executeAction();

      document.getElementById('admin-confirm-modal').classList.add('active');
    },

    // UC29: Desbanir Usuário
    confirmUnban: function (bannedId) {
      const banidos = window.NoteGStore ? window.NoteGStore.getBanidos() : [];
      const ban = banidos.find(b => b.id === bannedId);
      if (!ban) return;

      pendingAction = {
        type: 'unban',
        id: bannedId,
        nome: ban.nome
      };

      document.getElementById('admin-confirm-title').innerText = "Desbanir Usuário";
      document.getElementById('admin-confirm-message').innerText = `Deseja reativar o acesso de ${ban.nome}?`;
      
      const yesBtn = document.getElementById('admin-confirm-yes-btn');
      yesBtn.className = "btn btn-gradient-success";
      yesBtn.onclick = () => this.executeAction();

      document.getElementById('admin-confirm-modal').classList.add('active');
    },

    closeConfirm: function () {
      const modal = document.getElementById('admin-confirm-modal');
      if (modal) modal.classList.remove('active');
      pendingAction = null;
    },

    executeAction: function () {
      if (!pendingAction) return;

      const { type, id } = pendingAction;

      if (type === 'ban') {
        if (window.NoteGStore) {
          const newBan = window.NoteGStore.banUserFromDenuncia(id);
          if (window.showToastNotification) {
            window.showToastNotification(`Usuário foi banido com sucesso e adicionado à lista de suspensões.`);
          }
        }
      } else if (type === 'reject') {
        if (window.NoteGStore) {
          window.NoteGStore.rejectDenuncia(id);
          if (window.showToastNotification) {
            window.showToastNotification("A denúncia foi rejeitada com sucesso.");
          }
        }
      } else if (type === 'unban') {
        if (window.NoteGStore) {
          window.NoteGStore.unbanUser(id);
          if (window.showToastNotification) {
            // Document strict requirement: “Usuário reativado com sucesso.”
            window.showToastNotification("Usuário reativado com sucesso.");
          }
        }
      }

      this.closeConfirm();
      renderTables();
    }
  };
})();
