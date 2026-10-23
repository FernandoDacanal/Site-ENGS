// Note G# - Central Component Loader
(function () {
  'use strict';

  // Determine base path relative to current page
  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '../../' : './';
  window.APP_BASE_PATH = basePath;

  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + href;
    document.head.appendChild(link);
  }

  function loadJS(src) {
    const script = document.createElement('script');
    script.src = basePath + src;
    script.defer = true;
    document.head.appendChild(script);
  }

  // 1. Data Store & Global State
  loadJS('components/Store/store.js');

  // 2. Global Theme System (UC02)
  loadCSS('context/theme.css');
  loadJS('context/theme.js');

  // 3. Search Panel with live suggestions (UC13)
  loadCSS('components/SearchPanel/searchPanel.css');
  loadJS('components/SearchPanel/searchPanel.js');

  // 4. Authentication & Account Modals (UC03, UC04, UC05, UC06, UC07)
  loadCSS('components/AuthModals/authModals.css');
  loadJS('components/AuthModals/authModals.js');

  // 5. Page-specific modules
  const path = window.location.pathname;

  if (path.includes('/pages/artigos/')) {
    loadCSS('components/Artigos/artigos.css');
    loadJS('components/Artigos/artigos.js');
  } else if (path.includes('/pages/cientista/')) {
    loadCSS('components/Artigos/artigos.css');
    loadJS('components/Artigos/gerenciar.js');
  } else if (path.includes('/pages/foruns/')) {
    loadCSS('components/Foruns/foruns.css');
    loadJS('components/Foruns/foruns.js');
  } else if (path.includes('/pages/conta/')) {
    loadCSS('components/Perfil/perfil.css');
    loadJS('components/Perfil/perfil.js');
  } else if (path.includes('/pages/admin/')) {
    loadCSS('components/Admin/admin.css');
    loadJS('components/Admin/admin.js');
  }

  // 6. Sidebar active state sync
  function syncSidebarActive() {
    const navItems = document.querySelectorAll('.sidebar .nav .nav-item');
    if (!navItems.length) {
      setTimeout(syncSidebarActive, 150);
      return;
    }

    const currentUrl = window.location.pathname;

    navItems.forEach(item => {
      const link = item.querySelector('a.nav-link');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      item.classList.remove('active');

      if (currentUrl.endsWith('index.html') || currentUrl.endsWith('/') || currentUrl === '') {
        if (href.endsWith('index.html')) item.classList.add('active');
      } else if (currentUrl.includes('/pages/artigos/') && href.includes('artigos.html')) {
        item.classList.add('active');
      } else if (currentUrl.includes('/pages/foruns/') && href.includes('foruns.html')) {
        item.classList.add('active');
      } else if (currentUrl.includes('/pages/cientista/') && href.includes('gerenciar-artigos.html')) {
        item.classList.add('active');
      } else if (currentUrl.includes('/pages/admin/') && href.includes('moderation.html')) {
        item.classList.add('active');
      } else if (currentUrl.includes('/pages/conta/') && href.includes('perfil.html')) {
        item.classList.add('active');
      } else if (currentUrl.includes('/pages/comum/') && href.includes('sobrenos.html')) {
        item.classList.add('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncSidebarActive);
  } else {
    syncSidebarActive();
  }
})();
