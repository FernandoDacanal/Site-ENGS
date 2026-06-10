// Search Recommendations Panel Module
(function () {
  'use strict';

  // Mock data as requested
  let pesquisasRecentes = ["Física Quântica", "IA na Medicina", "Nota G#", "Arquitetura de Software", "Gulp vs Webpack"];
  const artigosRecomendados = [
    { id: 1, titulo: "Como a Inteligência Artificial modela o futuro", autor: "Prof. Marcos Silva", visualizacoes: "1.2k" },
    { id: 2, titulo: "Entendendo Git Flow e controle de versão", autor: "Luiza Santos", visualizacoes: "950" },
    { id: 3, titulo: "Introdução à Engenharia de Software Avançada", autor: "Dr. Fernando Dacanal", visualizacoes: "3.4k" }
  ];

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPanel);
  } else {
    initSearchPanel();
  }

  function initSearchPanel() {
    const searchField = document.querySelector('.search-field');
    const searchInput = searchField ? searchField.querySelector('input') : null;

    if (!searchField || !searchInput) {
      // Retry in case search field is loaded dynamically
      setTimeout(initSearchPanel, 200);
      return;
    }

    // Check if panel already exists
    if (document.getElementById('search-recommendations-panel')) return;

    // Create the panel element
    const panel = document.createElement('div');
    panel.id = 'search-recommendations-panel';
    panel.className = 'search-recommendations-panel';

    searchField.appendChild(panel);

    // Initial render
    renderPanelContent(panel, searchInput);

    // Show on focus
    searchInput.addEventListener('focus', () => {
      panel.style.display = 'block';
    });

    // Hide on click outside
    document.addEventListener('click', (e) => {
      if (!searchField.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    // Prevent panel close when clicking inside the panel (unless it's an action that should close it)
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function renderPanelContent(panel, searchInput) {
    let recentHtml = '';
    if (pesquisasRecentes.length === 0) {
      recentHtml = `<div class="text-center text-muted py-2" style="font-size:12px;">Sem pesquisas recentes</div>`;
    } else {
      recentHtml = pesquisasRecentes.map((search, idx) => `
        <li class="recent-item" data-search="${search}">
          <span class="recent-text"><i class="mdi mdi-clock-outline"></i> ${search}</span>
          <span class="remove-recent" data-idx="${idx}">&times;</span>
        </li>
      `).join('');
    }

    const recsHtml = artigosRecomendados.map(art => `
      <li class="recommendation-item" data-id="${art.id}">
        <span class="recommendation-title">${art.titulo}</span>
        <div class="recommendation-meta">
          <span class="recommendation-author">${art.autor}</span>
          <span class="recommendation-views"><i class="mdi mdi-eye-outline"></i> ${art.visualizacoes}</span>
        </div>
      </li>
    `).join('');

    panel.innerHTML = `
      <div class="panel-section">
        <h6 class="panel-section-title"><i class="mdi mdi-history me-2"></i>Pesquisas Recentes</h6>
        <ul class="recent-list">
          ${recentHtml}
        </ul>
      </div>
      <div class="panel-separator"></div>
      <div class="panel-section">
        <h6 class="panel-section-title"><i class="mdi mdi-star-outline me-2"></i>Artigos Recomendados</h6>
        <ul class="recommendations-list">
          ${recsHtml}
        </ul>
      </div>
    `;

    // Bind item click events
    panel.querySelectorAll('.recent-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-recent')) {
          e.stopPropagation();
          const idx = parseInt(e.target.getAttribute('data-idx'));
          pesquisasRecentes.splice(idx, 1);
          renderPanelContent(panel, searchInput);
          return;
        }
        const searchValue = item.getAttribute('data-search');
        searchInput.value = searchValue;
        panel.style.display = 'none';
        // Simulate trigger search
        console.log(`Pesquisando por: ${searchValue}`);
      });
    });

    panel.querySelectorAll('.recommendation-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const art = artigosRecomendados.find(a => a.id == id);
        panel.style.display = 'none';
        
        // Show styled custom toast notification
        showToastNotification(`Abrindo artigo: "${art.titulo}"`);
      });
    });
  }

  // Helper function to show notifications
  function showToastNotification(message) {
    let container = document.getElementById('custom-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'custom-toast-container';
      container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = `
      background-color: var(--card-bg, #ffffff);
      color: var(--text-color, #1f2937);
      border-left: 4px solid #a855f7;
      border-radius: 4px;
      padding: 12px 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 13px;
      font-weight: 500;
      min-width: 250px;
      max-width: 350px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: toastSlideIn 0.3s ease forwards;
    `;
    
    // Add keyframes dynamically if not present
    if (!document.getElementById('toast-keyframes')) {
      const style = document.createElement('style');
      style.id = 'toast-keyframes';
      style.innerHTML = `
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastFadeOut {
          to { transform: translateY(20px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    toast.innerHTML = `
      <span>${message}</span>
      <span style="cursor:pointer; font-weight:bold; margin-left:15px; font-size:16px;" onclick="this.parentElement.remove()">&times;</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Export helper globally so other modules can use it
  window.showToastNotification = showToastNotification;
})();
