// Central Component Loader
(function () {
  'use strict';

  // Get base path relative to the page location
  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '../../' : './';

  // Load CSS dynamically
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = basePath + href;
    document.head.appendChild(link);
  }

  // Load JS dynamically
  function loadJS(src) {
    const script = document.createElement('script');
    script.src = basePath + src;
    document.head.appendChild(script);
  }

  // 1. Load Theme System (Feature 1)
  loadCSS('context/theme.css');
  loadJS('context/theme.js');

  // 2. Load Search Recommendations Dropdown (Feature 2)
  loadCSS('components/SearchPanel/searchPanel.css');
  loadJS('components/SearchPanel/searchPanel.js');

  // 3. Load Auth Modals (Feature 3)
  loadCSS('components/AuthModals/authModals.css');
  loadJS('components/AuthModals/authModals.js');

  // 4. Load Admin Moderation dashboard assets if on moderation page (Feature 4)
  if (window.location.pathname.includes('/pages/admin/moderation.html')) {
    loadCSS('components/Admin/admin.css');
    loadJS('components/Admin/admin.js');
  }

  // 5. Inject Sidebar navigation link dynamically (Feature 4)
  function injectSidebarLink() {
    const sidebarUl = document.querySelector('.sidebar .nav');
    if (!sidebarUl) {
      setTimeout(injectSidebarLink, 200);
      return;
    }
    
    if (document.getElementById('sidebar-moderation-link')) return;

    const navItems = sidebarUl.querySelectorAll('.nav-item');
    let targetNode = null;
    
    for (let item of navItems) {
      if (item.querySelector('a')?.getAttribute('href')?.includes('documentation.html')) {
        targetNode = item;
        break;
      }
    }

    const modLi = document.createElement('li');
    modLi.id = 'sidebar-moderation-link';
    modLi.className = 'nav-item';
    
    const isCurrentPage = window.location.pathname.includes('pages/admin/moderation.html');
    if (isCurrentPage) {
      modLi.classList.add('active');
    }

    modLi.innerHTML = `
      <a class="nav-link" href="${basePath}pages/admin/moderation.html">
        <span class="menu-title">Moderação</span>
        <i class="mdi mdi-shield-account menu-icon" style="color: #a855f7;"></i>
      </a>
    `;

    if (targetNode) {
      sidebarUl.insertBefore(modLi, targetNode);
    } else {
      sidebarUl.appendChild(modLi);
    }
  }

  injectSidebarLink();
})();
