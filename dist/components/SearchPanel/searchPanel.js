// Search Recommendations Panel Module (UC13)
(function () {
  'use strict';

  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '../../' : './';

  let pesquisasRecentes = ["Física Quântica", "IA na Medicina", "Nota G#", "Arquitetura de Software", "Gulp vs Webpack"];
  const artigosRecomendados = [
    { id: 3, titulo: "Como a Inteligência Artificial modela o futuro", autor: "Prof. Marcos Silva", visualizacoes: "1.2k" },
    { id: 4, titulo: "Introdução à Engenharia de Software Avançada", autor: "Dr. Fernando Dacanal", visualizacoes: "3.4k" },
    { id: 1, titulo: "Introdução ao Vue 3 e o Futuro do Desenvolvimento Web", autor: "Lucas Almeida", visualizacoes: "2.1k" },
    { id: 2, titulo: "Guia de Otimização de Consultas SQL", autor: "Carlos Eduardo", visualizacoes: "950" }
  ];

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPanel);
  } else {
    initSearchPanel();
  }

  function initSearchPanel() {
    const searchField = document.querySelector('.search-field');
    const searchInput = searchField ? searchField.querySelector('input') : null;

    if (!searchField || !searchInput) {
      setTimeout(initSearchPanel, 200);
      return;
    }

    if (document.getElementById('search-recommendations-panel')) return;

    searchInput.setAttribute('placeholder', 'Pesquisar artigos, tópicos, autores...');

    const panel = document.createElement('div');
    panel.id = 'search-recommendations-panel';
    panel.className = 'search-recommendations-panel';

    searchField.appendChild(panel);

    renderPanelContent(panel, searchInput);

    // Show on focus
    searchInput.addEventListener('focus', () => {
      panel.style.display = 'block';
    });

    // Handle Enter press
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          if (!pesquisasRecentes.includes(query)) {
            pesquisasRecentes.unshift(query);
            if (pesquisasRecentes.length > 5) pesquisasRecentes.pop();
          }
          panel.style.display = 'none';
          
          if (window.location.pathname.includes('artigos.html') && window.ArtigosApp) {
            window.ArtigosApp.searchFilter(query);
          } else {
            window.location.href = `${basePath}pages/artigos/artigos.html?q=${encodeURIComponent(query)}`;
          }
        }
      }
    });

    // CA01: Hide on click outside
    document.addEventListener('click', (e) => {
      if (!searchField.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

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
          <span class="remove-recent" data-idx="${idx}" title="Remover">&times;</span>
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
        <h6 class="panel-section-title"><i class="mdi mdi-history me-2"></i>PESQUISAS RECENTES</h6>
        <ul class="recent-list">
          ${recentHtml}
        </ul>
      </div>
      <div class="panel-separator"></div>
      <div class="panel-section">
        <h6 class="panel-section-title"><i class="mdi mdi-star-outline me-2"></i>ARTIGOS RECOMENDADOS</h6>
        <ul class="recommendations-list">
          ${recsHtml}
        </ul>
      </div>
    `;

    // Item click
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

        if (window.location.pathname.includes('artigos.html') && window.ArtigosApp) {
          window.ArtigosApp.searchFilter(searchValue);
        } else {
          window.location.href = `${basePath}pages/artigos/artigos.html?q=${encodeURIComponent(searchValue)}`;
        }
      });
    });

    panel.querySelectorAll('.recommendation-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        panel.style.display = 'none';
        window.location.href = `${basePath}pages/artigos/artigos.html?id=${id}`;
      });
    });
  }
})();
