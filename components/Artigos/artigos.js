// Artigos Catalog & Reading Module (UC13, UC14, UC15, UC16)
(function () {
  'use strict';

  let currentCategory = 'Todos';
  let searchQuery = '';
  let activeArticleId = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArtigosApp);
  } else {
    initArtigosApp();
  }

  function initArtigosApp() {
    if (!document.getElementById('artigos-catalog-view')) return;

    setupFilters();
    checkUrlParams();
    renderCatalog();
    injectReportModal();
    injectShareModal();
  }

  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const q = params.get('q');

    if (id) {
      openArticle(parseInt(id), false);
    } else if (q) {
      searchQuery = q;
      const filterInput = document.getElementById('catalog-search-input');
      if (filterInput) filterInput.value = q;
    }
  }

  function setupFilters() {
    const filterBtns = document.querySelectorAll('.artigos-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat') || 'Todos';
        renderCatalog();
      });
    });

    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderCatalog();
      });
    }
  }

  function renderCatalog() {
    const container = document.getElementById('artigos-cards-list');
    if (!container) return;

    const allArticles = window.NoteGStore ? window.NoteGStore.getArticles() : [];

    let filtered = allArticles.filter(art => {
      const matchCat = currentCategory === 'Todos' || art.categoria.toLowerCase() === currentCategory.toLowerCase();
      const matchSearch = !searchQuery || 
        art.titulo.toLowerCase().includes(searchQuery) || 
        art.autor.toLowerCase().includes(searchQuery) || 
        art.resumo.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="mdi mdi-book-search-outline" style="font-size: 48px; color: var(--text-muted);"></i>
          <h5 class="mt-3 text-muted">Nenhum artigo encontrado para o filtro selecionado.</h5>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(art => `
      <div class="col-md-6 grid-margin stretch-card">
        <div class="artigo-card w-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="artigo-badge-cat">${art.categoria}</span>
              <span class="text-muted" style="font-size:12px;"><i class="mdi mdi-calendar-outline me-1"></i>${art.data}</span>
            </div>
            <h4 class="artigo-title" onclick="window.ArtigosApp.openArticle(${art.id})" style="cursor:pointer;">
              ${art.titulo}
            </h4>
            <p class="artigo-snippet">${art.resumo}</p>
          </div>
          <div class="artigo-meta">
            <div class="artigo-author">
              <i class="mdi mdi-account-circle text-primary" style="font-size:20px;"></i>
              <span>${art.autor}</span>
            </div>
            <a class="artigo-link-btn" onclick="window.ArtigosApp.openArticle(${art.id}); return false;">
              Ler artigo completo <i class="mdi mdi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openArticle(id, updateHistory = true) {
    const art = window.NoteGStore ? window.NoteGStore.getArticleById(id) : null;
    if (!art) return;

    activeArticleId = id;

    if (updateHistory) {
      const url = new URL(window.location);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url);
    }

    // Toggle views
    document.getElementById('artigos-catalog-view').style.display = 'none';
    const readingView = document.getElementById('artigos-reading-view');
    readingView.classList.add('active');

    // Populate reading view
    document.getElementById('reading-cat-badge').innerText = art.categoria;
    document.getElementById('reading-date').innerText = `Publicado em ${art.data}`;
    document.getElementById('reading-title').innerText = art.titulo;
    document.getElementById('reading-body').innerHTML = art.conteudo.split('\n\n').map(p => {
      if (p.startsWith('### ')) {
        return `<h3>${p.replace('### ', '')}</h3>`;
      }
      return `<p>${p}</p>`;
    }).join('');

    // Quote
    const quoteContainer = document.getElementById('reading-quote-box');
    if (art.citacao) {
      quoteContainer.style.display = 'block';
      quoteContainer.innerText = `"${art.citacao}"`;
    } else {
      quoteContainer.style.display = 'none';
    }

    // Sidebar
    document.getElementById('author-name').innerText = art.autor;
    document.getElementById('author-role').innerText = art.cargoAutor || "Pesquisador Credenciado";
    document.getElementById('read-time').innerText = art.tempoLeitura || "5 minutos de leitura";

    const collabList = document.getElementById('collab-list');
    if (art.colaboradores && art.colaboradores.length > 0) {
      collabList.innerHTML = art.colaboradores.map(c => `
        <span class="badge badge-outline-secondary me-1 mb-1" style="font-size:12px; padding:6px 10px;">
          <i class="mdi mdi-account-multiple me-1"></i>${c}
        </span>
      `).join('');
      document.getElementById('collab-card').style.display = 'block';
    } else {
      document.getElementById('collab-card').style.display = 'none';
    }

    // Interactions
    updateLikesDisplay(art);
    renderComments(art);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeArticle() {
    activeArticleId = null;
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    document.getElementById('artigos-reading-view').classList.remove('active');
    document.getElementById('artigos-catalog-view').style.display = 'block';
    renderCatalog();
  }

  function updateLikesDisplay(art) {
    const likeBtn = document.getElementById('btn-like-article');
    const likeCount = document.getElementById('like-count');
    if (!likeBtn || !likeCount) return;

    likeCount.innerText = art.curtidas;
    if (art.curtido) {
      likeBtn.classList.add('liked');
      likeBtn.querySelector('i').className = 'mdi mdi-thumb-up';
    } else {
      likeBtn.classList.remove('liked');
      likeBtn.querySelector('i').className = 'mdi mdi-thumb-up-outline';
    }
  }

  function renderComments(art) {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    if (!commentsList || !commentsCount) return;

    commentsCount.innerText = `${art.comentarios ? art.comentarios.length : 0} Comentários`;

    if (!art.comentarios || art.comentarios.length === 0) {
      commentsList.innerHTML = `<p class="text-muted text-center py-3">Seja o primeiro a comentar sobre este artigo!</p>`;
      return;
    }

    commentsList.innerHTML = art.comentarios.map(c => `
      <div class="comment-item">
        <img src="${c.avatar || '../../assets/images/faces/face10.jpg'}" class="comment-avatar" alt="${c.autor}">
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${c.autor}</span>
            <span class="comment-time">${c.tempo}</span>
          </div>
          <p class="comment-text mb-0">${c.texto}</p>
        </div>
      </div>
    `).join('');
  }

  function injectReportModal() {
    if (document.getElementById('report-article-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'report-article-modal';
    modal.className = 'report-modal-overlay';
    modal.innerHTML = `
      <div class="report-modal-card">
        <h4 class="mb-3 font-weight-bold" style="color:var(--text-color);">Denunciar Conteúdo</h4>
        <p class="text-muted" style="font-size:13px; margin-bottom:18px;">
          Selecione a categoria da violação para análise imediata pela equipe de moderação.
        </p>
        <form id="form-denunciar" onsubmit="event.preventDefault(); window.ArtigosApp.submitReport();">
          <div class="form-group mb-3">
            <label class="form-label font-weight-bold" style="font-size:13px; color:var(--text-color);">Categoria da Denúncia *</label>
            <select class="form-control" id="report-category" required>
              <option value="">Selecione uma opção...</option>
              <option value="Plágio Integral">Plágio Integral / Cópia não autorizada</option>
              <option value="Fake News Científica">Fake News Científica / Dados fraudulentos</option>
              <option value="Linguagem Ofensiva">Linguagem Ofensiva / Violação das diretrizes</option>
              <option value="Spam ou Comercial">Spam / Conteúdo puramente comercial</option>
              <option value="Outro">Outro motivo</option>
            </select>
          </div>
          <div class="form-group mb-4">
            <label class="form-label font-weight-bold" style="font-size:13px; color:var(--text-color);">Descrição / Motivo Detalhado *</label>
            <textarea class="form-control" id="report-reason" rows="3" placeholder="Explique brevemente o motivo da denúncia..." required></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary me-2" onclick="window.ArtigosApp.closeReportModal()">Cancelar</button>
            <button type="submit" class="btn btn-gradient-danger">Enviar Denúncia</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.ArtigosApp.closeReportModal();
      }
    });
  }

  function injectShareModal() {
    if (document.getElementById('share-article-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'share-article-modal';
    modal.className = 'report-modal-overlay';
    modal.innerHTML = `
      <div class="report-modal-card">
        <h4 class="mb-3 font-weight-bold" style="color:var(--text-color);">Compartilhar Artigo</h4>
        <p class="text-muted" style="font-size:13px; margin-bottom:18px;">
          Compartilhe conhecimento com sua rede de pesquisadores e colegas.
        </p>
        <div class="input-group mb-3">
          <input type="text" id="share-link-input" class="form-control" readonly>
          <button class="btn btn-gradient-primary" type="button" onclick="window.ArtigosApp.copyShareLink()">Copiar</button>
        </div>
        <div class="d-flex justify-content-center gap-3 my-3">
          <button class="btn btn-outline-primary btn-icon" onclick="window.ArtigosApp.shareNetwork('twitter')"><i class="mdi mdi-twitter"></i></button>
          <button class="btn btn-outline-info btn-icon" onclick="window.ArtigosApp.shareNetwork('linkedin')"><i class="mdi mdi-linkedin"></i></button>
          <button class="btn btn-outline-success btn-icon" onclick="window.ArtigosApp.shareNetwork('whatsapp')"><i class="mdi mdi-whatsapp"></i></button>
        </div>
        <div class="text-end mt-4">
          <button type="button" class="btn btn-secondary" onclick="window.ArtigosApp.closeShareModal()">Fechar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.ArtigosApp.closeShareModal();
      }
    });
  }

  // Global interface
  window.ArtigosApp = {
    openArticle: openArticle,
    closeArticle: closeArticle,

    searchFilter: function (q) {
      searchQuery = q.toLowerCase();
      renderCatalog();
    },

    toggleLike: function () {
      if (!activeArticleId) return;

      const user = window.NoteGStore ? window.NoteGStore.getUser() : null;
      if (user && user.role === 'visitante') {
        if (window.showToastNotification) {
          window.showToastNotification("Faça login para curtir artigos.", "warning");
        }
        if (window.AuthModals) window.AuthModals.open('login');
        return;
      }

      const updated = window.NoteGStore.toggleLike(activeArticleId);
      if (updated) {
        updateLikesDisplay(updated);
        if (window.showToastNotification) {
          window.showToastNotification(updated.curtido ? "Você curtiu este artigo!" : "Curtida removida.");
        }
      }
    },

    submitComment: function () {
      if (!activeArticleId) return;

      const user = window.NoteGStore ? window.NoteGStore.getUser() : null;
      if (user && user.role === 'visitante') {
        if (window.showToastNotification) {
          window.showToastNotification("Faça login para postar comentários.", "warning");
        }
        if (window.AuthModals) window.AuthModals.open('login');
        return;
      }

      const input = document.getElementById('comment-input');
      if (!input || !input.value.trim()) return;

      const comment = window.NoteGStore.addComment(activeArticleId, input.value.trim());
      input.value = '';

      const art = window.NoteGStore.getArticleById(activeArticleId);
      renderComments(art);

      if (window.showToastNotification) {
        window.showToastNotification("Comentário publicado com sucesso!");
      }
    },

    openReportModal: function () {
      const user = window.NoteGStore ? window.NoteGStore.getUser() : null;
      if (user && user.role === 'visitante') {
        if (window.showToastNotification) {
          window.showToastNotification("Faça login para denunciar artigos.", "warning");
        }
        if (window.AuthModals) window.AuthModals.open('login');
        return;
      }

      const modal = document.getElementById('report-article-modal');
      if (modal) modal.classList.add('active');
    },

    closeReportModal: function () {
      const modal = document.getElementById('report-article-modal');
      if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('form-denunciar');
        if (form) form.reset();
      }
    },

    submitReport: function () {
      const category = document.getElementById('report-category').value;
      const reason = document.getElementById('report-reason').value;
      const art = window.NoteGStore.getArticleById(activeArticleId);

      if (!category || !reason || !art) return;

      window.NoteGStore.addDenuncia({
        autor: art.autor,
        titulo: art.titulo,
        motivo: reason,
        categoria: category
      });

      this.closeReportModal();

      if (window.showToastNotification) {
        window.showToastNotification("Denúncia enviada com sucesso para análise dos moderadores.");
      }
    },

    openShareModal: function () {
      const modal = document.getElementById('share-article-modal');
      const input = document.getElementById('share-link-input');
      if (input) input.value = window.location.href;
      if (modal) modal.classList.add('active');
    },

    closeShareModal: function () {
      const modal = document.getElementById('share-article-modal');
      if (modal) modal.classList.remove('active');
    },

    copyShareLink: function () {
      const input = document.getElementById('share-link-input');
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
          if (window.showToastNotification) {
            window.showToastNotification("Link copiado para a área de transferência!");
          }
        });
      }
    },

    shareNetwork: function (network) {
      if (window.showToastNotification) {
        window.showToastNotification(`Compartilhando no ${network.toUpperCase()}...`);
      }
      this.closeShareModal();
    }
  };
})();
