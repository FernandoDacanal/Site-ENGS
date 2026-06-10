// Admin Moderation Module
(function () {
  'use strict';

  // Mock data as requested
  let denuncias = [
    { id: 1, autor: "Lucas Oliver", titulo: "O Impacto dos Buracos Negros", motivo: "Plágio Integral", data: "2026-06-08" },
    { id: 2, autor: "Sophia Rezende", titulo: "A Nova Era dos Chips de Silício", motivo: "Fake News Científica", data: "2026-06-09" },
    { id: 3, autor: "Enzo Almeida", titulo: "Entendendo o React sem Virtual DOM", motivo: "Linguagem Ofensiva", data: "2026-06-09" }
  ];

  let banidos = [
    { id: 101, nome: "Gustavo Nogueira", email: "gustavo@exemplo.com", dataBan: "2026-05-15" },
    { id: 102, nome: "Camila Vilela", email: "camila@exemplo.com", dataBan: "2026-05-22" }
  ];

  // Variables for confirmation modal state
  let pendingAction = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
  } else {
    initAdminPanel();
  }

  function initAdminPanel() {
    // Check if on moderation page
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
        document.getElementById(target).classList.add('active');
      });
    });
  }

  function renderTables() {
    // 1. Render Reports Table
    const reportsBody = document.getElementById('reports-table-body');
    if (reportsBody) {
      if (denuncias.length === 0) {
        reportsBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center py-4 text-muted">Nenhuma denúncia pendente.</td>
          </tr>
        `;
      } else {
        reportsBody.innerHTML = denuncias.map(d => `
          <tr>
            <td><strong>${d.titulo}</strong></td>
            <td>${d.autor}</td>
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

    // 2. Render Banned Users Table
    const bannedBody = document.getElementById('banned-table-body');
    if (bannedBody) {
      if (banidos.length === 0) {
        bannedBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center py-4 text-muted">Nenhum usuário banido no momento.</td>
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

    // Bind overlay click to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.AdminPanel.closeConfirm();
      }
    });
  }

  // Global interface for button clicks
  window.AdminPanel = {
    confirmBan: function (denunciaId) {
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

    confirmReject: function (denunciaId) {
      const den = denuncias.find(d => d.id === denunciaId);
      if (!den) return;

      pendingAction = {
        type: 'reject',
        id: denunciaId
      };

      document.getElementById('admin-confirm-title').innerText = "Rejeitar Denúncia";
      document.getElementById('admin-confirm-message').innerText = `Tem certeza que deseja rejeitar a denúncia sobre o artigo "${den.titulo}"?`;
      
      const yesBtn = document.getElementById('admin-confirm-yes-btn');
      yesBtn.className = "btn btn-gradient-warning";
      yesBtn.onclick = () => this.executeAction();

      document.getElementById('admin-confirm-modal').classList.add('active');
    },

    confirmUnban: function (bannedId) {
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
      document.getElementById('admin-confirm-modal').classList.remove('active');
      pendingAction = null;
    },

    executeAction: function () {
      if (!pendingAction) return;

      const { type, id } = pendingAction;

      if (type === 'ban') {
        const den = denuncias.find(d => d.id === id);
        if (den) {
          // Remove from reports
          denuncias = denuncias.filter(d => d.id !== id);
          
          // Add to banned
          const newBan = {
            id: Date.now() % 1000,
            nome: den.autor,
            email: `${den.autor.toLowerCase().replace(' ', '')}@exemplo.com`,
            dataBan: new Date().toISOString().split('T')[0]
          };
          banidos.push(newBan);

          if (window.showToastNotification) {
            window.showToastNotification(`Usuário "${den.autor}" foi banido e o artigo foi removido.`);
          }
        }
      } else if (type === 'reject') {
        denuncias = denuncias.filter(d => d.id !== id);
        if (window.showToastNotification) {
          window.showToastNotification("A denúncia foi rejeitada com sucesso.");
        }
      } else if (type === 'unban') {
        const banUser = banidos.find(b => b.id === id);
        banidos = banidos.filter(b => b.id !== id);
        
        if (window.showToastNotification) {
          // Document strict success text: “Usuário reativado com sucesso.”
          window.showToastNotification("Usuário reativado com sucesso.");
        }
      }

      this.closeConfirm();
      renderTables();
    }
  };
})();
