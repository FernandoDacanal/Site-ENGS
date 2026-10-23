// Gerenciador de Artigos & Publicações Científicas (UC18, UC19, UC20)
(function () {
  'use strict';

  let editingArticleId = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGerenciador);
  } else {
    initGerenciador();
  }

  function initGerenciador() {
    if (!document.getElementById('manager-articles-table-body')) return;

    renderArticlesTable();
    setupForms();
  }

  function renderArticlesTable() {
    const tbody = document.getElementById('manager-articles-table-body');
    if (!tbody) return;

    const articles = window.NoteGStore ? window.NoteGStore.getArticles() : [];

    if (articles.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">Nenhum artigo cadastrado no momento.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = articles.map(art => {
      const statusBadge = art.status === 'Publicado' 
        ? '<label class="badge badge-gradient-success">Publicado</label>' 
        : art.status === 'Em Revisão'
        ? '<label class="badge badge-gradient-info">Em Revisão</label>'
        : '<label class="badge badge-gradient-warning">Rascunho</label>';

      const collabs = art.colaboradores && art.colaboradores.length > 0 
        ? art.colaboradores.join(', ') 
        : '<span class="text-muted">-</span>';

      return `
        <tr>
          <td><strong style="color:var(--text-color);">${art.titulo}</strong></td>
          <td>${art.autor}</td>
          <td>${collabs}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-gradient-info me-1" onclick="window.GerenciadorArtigos.loadForEdit(${art.id})">
              <i class="mdi mdi-pencil"></i> Editar / Colaboradores
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.GerenciadorArtigos.deleteArticle(${art.id})">
              <i class="mdi mdi-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function setupForms() {
    // 1. Create Article Form (UC18)
    const createForm = document.getElementById('form-create-article');
    if (createForm) {
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('new-art-title').value.trim();
        const category = document.getElementById('new-art-cat').value.trim();
        const status = document.getElementById('new-art-status').value;
        const content = document.getElementById('new-art-content').value.trim();

        // CA01: Check empty fields
        if (!title || !category || !content) {
          if (window.showToastNotification) {
            window.showToastNotification("Por favor, preencha todos os campos obrigatórios.", "error");
          }
          return;
        }

        window.NoteGStore.saveArticle({
          titulo: title,
          categoria: category,
          status: status,
          conteudo: content
        });

        createForm.reset();
        renderArticlesTable();

        if (window.showToastNotification) {
          window.showToastNotification("Artigo salvo com sucesso!");
        }
      });
    }

    // 2. Edit Article Form (UC19)
    const editForm = document.getElementById('form-edit-article');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingArticleId) {
          if (window.showToastNotification) {
            window.showToastNotification("Selecione um artigo na tabela para editar.", "warning");
          }
          return;
        }

        const title = document.getElementById('edit-art-title').value.trim();
        const category = document.getElementById('edit-art-cat').value.trim();
        const status = document.getElementById('edit-art-status').value;
        const content = document.getElementById('edit-art-content').value.trim();
        const collabsRaw = document.getElementById('edit-art-collabs').value.trim();

        if (!title || !category || !content) {
          if (window.showToastNotification) {
            window.showToastNotification("Campos obrigatórios não podem ficar vazios.", "error");
          }
          return;
        }

        const collabs = collabsRaw 
          ? collabsRaw.split(',').map(c => c.trim()).filter(c => c.length > 0)
          : [];

        window.NoteGStore.saveArticle({
          id: editingArticleId,
          titulo: title,
          categoria: category,
          status: status,
          conteudo: content,
          colaboradores: collabs
        });

        if (window.showToastNotification) {
          window.showToastNotification("Artigo atualizado com sucesso!");
        }

        window.GerenciadorArtigos.cancelEdit();
        renderArticlesTable();
      });
    }
  }

  window.GerenciadorArtigos = {
    loadForEdit: function (id) {
      const art = window.NoteGStore.getArticleById(id);
      if (!art) return;

      editingArticleId = id;

      document.getElementById('edit-art-title').value = art.titulo;
      document.getElementById('edit-art-cat').value = art.categoria;
      document.getElementById('edit-art-status').value = art.status;
      document.getElementById('edit-art-content').value = art.conteudo;
      document.getElementById('edit-art-collabs').value = art.colaboradores ? art.colaboradores.join(', ') : '';

      const editCard = document.getElementById('card-edit-article');
      if (editCard) {
        editCard.scrollIntoView({ behavior: 'smooth' });
        editCard.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)';
        setTimeout(() => {
          editCard.style.boxShadow = '';
        }, 1500);
      }

      if (window.showToastNotification) {
        window.showToastNotification(`Editando: "${art.titulo}"`);
      }
    },

    cancelEdit: function () {
      editingArticleId = null;
      const editForm = document.getElementById('form-edit-article');
      if (editForm) editForm.reset();
    },

    deleteArticle: function (id) {
      if (confirm("Tem certeza que deseja excluir este artigo permanentemente?")) {
        window.NoteGStore.deleteArticle(id);
        renderArticlesTable();
        if (window.showToastNotification) {
          window.showToastNotification("Artigo removido.");
        }
      }
    }
  };
})();
