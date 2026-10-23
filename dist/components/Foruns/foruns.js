// Fóruns & Moderação de Tópicos (UC21, UC22, UC23, UC24)
(function () {
  'use strict';

  let editingForumId = null;
  let viewingForumId = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForunsApp);
  } else {
    initForunsApp();
  }

  function initForunsApp() {
    if (!document.getElementById('forums-table-body')) return;

    renderForumsTable();
    populateForumSelects();
    setupForms();
    injectForumConfirmModal();
    injectViewTopicsModal();
  }

  function renderForumsTable() {
    const tbody = document.getElementById('forums-table-body');
    if (!tbody) return;

    const forums = window.NoteGStore ? window.NoteGStore.getForums() : [];

    tbody.innerHTML = forums.map(f => {
      const isActive = f.status === 'Ativo';
      const statusBadge = isActive 
        ? '<span class="badge-forum-active"><i class="mdi mdi-check-circle me-1"></i>Ativo</span>'
        : '<span class="badge-forum-inactive"><i class="mdi mdi-lock me-1"></i>Inativo / Fechado</span>';

      const toggleActionBtn = isActive
        ? `<button class="btn btn-sm btn-outline-danger me-1" onclick="window.ForunsApp.promptCloseForum(${f.id})" title="Fechar Fórum (UC24)">
             <i class="mdi mdi-lock"></i> Fechar
           </button>`
        : `<button class="btn btn-sm btn-outline-success me-1" onclick="window.ForunsApp.reopenForum(${f.id})" title="Reabrir Fórum">
             <i class="mdi mdi-lock-open"></i> Reabrir
           </button>`;

      return `
        <tr>
          <td>
            <strong style="color:var(--text-color); font-size:14px;">${f.nome}</strong>
            <p class="text-muted mb-0" style="font-size:12px;">${f.descricao}</p>
          </td>
          <td>
            <span class="badge badge-outline-info" style="font-size:12px; font-weight:600;">
              ${f.topicosCount || (f.topicos ? f.topicos.length : 0)} tópicos
            </span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-gradient-primary me-1" onclick="window.ForunsApp.viewTopics(${f.id})">
              <i class="mdi mdi-forum"></i> Ver Tópicos
            </button>
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="window.ForunsApp.loadForEdit(${f.id})" title="Editar Fórum (UC23)">
              <i class="mdi mdi-pencil"></i>
            </button>
            ${toggleActionBtn}
          </td>
        </tr>
      `;
    }).join('');
  }

  function populateForumSelects() {
    const forums = window.NoteGStore ? window.NoteGStore.getForums() : [];
    
    // Create topic forum select
    const topicSelect = document.getElementById('new-topic-forum-id');
    if (topicSelect) {
      topicSelect.innerHTML = '<option value="">Selecione o fórum desejado...</option>' + 
        forums.map(f => `<option value="${f.id}" ${f.status !== 'Ativo' ? 'disabled' : ''}>${f.nome} ${f.status !== 'Ativo' ? '(Fechado)' : ''}</option>`).join('');
    }

    // Edit forum select
    const editSelect = document.getElementById('edit-forum-select');
    if (editSelect) {
      editSelect.innerHTML = '<option value="">Selecione um fórum na tabela...</option>' +
        forums.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
    }
  }

  function setupForms() {
    // 1. Create Topic Form (UC22)
    const topicForm = document.getElementById('form-create-topic');
    if (topicForm) {
      topicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = window.NoteGStore ? window.NoteGStore.getUser() : null;
        if (user && user.role === 'visitante') {
          if (window.showToastNotification) {
            window.showToastNotification("Visitantes não podem publicar tópicos. Faça login.", "warning");
          }
          if (window.AuthModals) window.AuthModals.open('login');
          return;
        }

        const forumId = document.getElementById('new-topic-forum-id').value;
        const title = document.getElementById('new-topic-title').value.trim();
        const message = document.getElementById('new-topic-message').value.trim();

        if (!forumId || !title || !message) {
          if (window.showToastNotification) {
            window.showToastNotification("Preencha todos os campos do tópico.", "error");
          }
          return;
        }

        const topic = window.NoteGStore.addTopic(forumId, title, message);
        topicForm.reset();
        renderForumsTable();
        populateForumSelects();

        if (window.showToastNotification) {
          window.showToastNotification("Tópico publicado com sucesso no fórum!");
        }
      });
    }

    // 2. Edit Forum Form (UC23, UC24)
    const editForm = document.getElementById('form-edit-forum');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingForumId) {
          if (window.showToastNotification) {
            window.showToastNotification("Selecione um fórum para editar.", "warning");
          }
          return;
        }

        const name = document.getElementById('edit-forum-name').value.trim();
        const desc = document.getElementById('edit-forum-desc').value.trim();
        const status = document.getElementById('edit-forum-status').value;

        if (!name || !desc) {
          if (window.showToastNotification) {
            window.showToastNotification("Campos obrigatórios não podem ficar vazios.", "error");
          }
          return;
        }

        // If status changed to Inativo -> triggers confirmation (UC24)
        const currentForum = window.NoteGStore.getForumById(editingForumId);
        if (currentForum.status === 'Ativo' && status === 'Inativo') {
          window.ForunsApp.promptCloseForum(editingForumId, () => {
            window.NoteGStore.saveForum({
              id: editingForumId,
              nome: name,
              descricao: desc,
              status: 'Inativo'
            });
            window.ForunsApp.cancelEdit();
            renderForumsTable();
            populateForumSelects();
          });
          return;
        }

        window.NoteGStore.saveForum({
          id: editingForumId,
          nome: name,
          descricao: desc,
          status: status
        });

        if (window.showToastNotification) {
          window.showToastNotification("Fórum atualizado com sucesso!");
        }

        window.ForunsApp.cancelEdit();
        renderForumsTable();
        populateForumSelects();
      });
    }
  }

  function injectForumConfirmModal() {
    if (document.getElementById('forum-confirm-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'forum-confirm-modal';
    modal.className = 'admin-confirm-overlay';
    modal.innerHTML = `
      <div class="admin-confirm-card">
        <h4 class="admin-confirm-title" id="forum-modal-title">Fechar Fórum</h4>
        <p class="admin-confirm-message" id="forum-modal-message">
          Tem certeza que deseja fechar este fórum para limitar novas postagens? Novos tópicos não poderão ser criados enquanto estiver inativo.
        </p>
        <div class="admin-confirm-actions">
          <button class="btn btn-outline-secondary me-2" onclick="window.ForunsApp.closeConfirmModal()">Cancelar</button>
          <button class="btn btn-gradient-danger" id="forum-confirm-yes-btn">Confirmar Fechamento</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.ForunsApp.closeConfirmModal();
      }
    });
  }

  function injectViewTopicsModal() {
    if (document.getElementById('view-topics-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'view-topics-modal';
    modal.className = 'report-modal-overlay';
    modal.innerHTML = `
      <div class="report-modal-card" style="max-width: 650px; max-height:85vh; overflow-y:auto;">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="font-weight-bold mb-0" id="view-topics-forum-title" style="color:var(--text-color);">Tópicos do Fórum</h4>
          <button class="auth-modal-close" style="position:static;" onclick="window.ForunsApp.closeViewTopicsModal()">&times;</button>
        </div>
        <p class="text-muted" id="view-topics-forum-desc" style="font-size:13px;"></p>
        <div id="view-topics-list" class="mt-3"></div>
        <div class="text-end mt-4">
          <button type="button" class="btn btn-secondary" onclick="window.ForunsApp.closeViewTopicsModal()">Fechar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.ForunsApp.closeViewTopicsModal();
      }
    });
  }

  // Global methods
  window.ForunsApp = {
    loadForEdit: function (id) {
      const f = window.NoteGStore ? window.NoteGStore.getForumById(id) : null;
      if (!f) return;

      editingForumId = id;
      const select = document.getElementById('edit-forum-select');
      if (select) select.value = id;

      document.getElementById('edit-forum-name').value = f.nome;
      document.getElementById('edit-forum-desc').value = f.descricao;
      document.getElementById('edit-forum-status').value = f.status;

      const editCard = document.getElementById('card-edit-forum');
      if (editCard) {
        editCard.scrollIntoView({ behavior: 'smooth' });
        editCard.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
        setTimeout(() => editCard.style.boxShadow = '', 1500);
      }
    },

    cancelEdit: function () {
      editingForumId = null;
      const form = document.getElementById('form-edit-forum');
      if (form) form.reset();
      const select = document.getElementById('edit-forum-select');
      if (select) select.value = '';
    },

    promptCloseForum: function (id, onConfirmCallback) {
      const f = window.NoteGStore ? window.NoteGStore.getForumById(id) : null;
      if (!f) return;

      const modal = document.getElementById('forum-confirm-modal');
      const yesBtn = document.getElementById('forum-confirm-yes-btn');

      yesBtn.onclick = () => {
        if (onConfirmCallback) {
          onConfirmCallback();
        } else {
          window.NoteGStore.closeForum(id);
          renderForumsTable();
          populateForumSelects();
          if (window.showToastNotification) {
            window.showToastNotification(`O fórum "${f.nome}" foi fechado.`);
          }
        }
        window.ForunsApp.closeConfirmModal();
      };

      if (modal) modal.classList.add('active');
    },

    reopenForum: function (id) {
      const f = window.NoteGStore ? window.NoteGStore.getForumById(id) : null;
      if (!f) return;

      window.NoteGStore.reopenForum(id);
      renderForumsTable();
      populateForumSelects();

      if (window.showToastNotification) {
        window.showToastNotification(`O fórum "${f.nome}" foi reaberto.`);
      }
    },

    closeConfirmModal: function () {
      const modal = document.getElementById('forum-confirm-modal');
      if (modal) modal.classList.remove('active');
    },

    viewTopics: function (id) {
      const f = window.NoteGStore ? window.NoteGStore.getForumById(id) : null;
      if (!f) return;

      document.getElementById('view-topics-forum-title').innerText = f.nome;
      document.getElementById('view-topics-forum-desc').innerText = f.descricao;

      const listContainer = document.getElementById('view-topics-list');
      if (!f.topicos || f.topicos.length === 0) {
        listContainer.innerHTML = `<div class="text-center py-4 text-muted">Ainda não há tópicos criados neste fórum. Seja o primeiro a criar um!</div>`;
      } else {
        listContainer.innerHTML = f.topicos.map(t => `
          <div class="forum-topic-item">
            <div>
              <div class="forum-topic-title">${t.titulo}</div>
              <div class="forum-topic-meta">
                <i class="mdi mdi-account-circle me-1"></i>${t.autor} &bull; ${t.data}
              </div>
            </div>
            <span class="badge badge-outline-primary" style="font-size:11px;">
              <i class="mdi mdi-comment-multiple-outline me-1"></i>${t.respostas || 0} respostas
            </span>
          </div>
        `).join('');
      }

      const modal = document.getElementById('view-topics-modal');
      if (modal) modal.classList.add('active');
    },

    closeViewTopicsModal: function () {
      const modal = document.getElementById('view-topics-modal');
      if (modal) modal.classList.remove('active');
    }
  };
})();
