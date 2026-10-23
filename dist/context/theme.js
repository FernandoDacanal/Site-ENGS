// Global Theme System Module
(function () {
  'use strict';

  // Apply saved theme immediately before DOMContentLoaded to prevent flickering
  const savedTheme = localStorage.getItem('site-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark' && document.body) {
    document.body.classList.add('dark-theme');
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      syncBodyClass();
      initThemeToggle();
    });
  } else {
    syncBodyClass();
    initThemeToggle();
  }

  function syncBodyClass() {
    const theme = localStorage.getItem('site-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }

  function initThemeToggle() {
    const navbarNav = document.querySelector('.navbar-nav-right');
    if (!navbarNav) {
      setTimeout(initThemeToggle, 200);
      return;
    }

    if (document.getElementById('theme-toggle-btn')) return;

    // Create toggle list item
    const toggleLi = document.createElement('li');
    toggleLi.className = 'nav-item theme-toggle-item';
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const iconClass = currentTheme === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny';

    toggleLi.innerHTML = `
      <a class="nav-link" id="theme-toggle-btn" href="#" title="Alternar Tema Claro/Escuro" style="cursor: pointer; padding: 0.5rem;">
        <i class="mdi ${iconClass}" id="theme-toggle-icon" style="font-size: 20px;"></i>
      </a>
    `;

    // Insert before profile or at the right spot
    const profileItem = navbarNav.querySelector('.nav-profile');
    if (profileItem) {
      navbarNav.insertBefore(toggleLi, profileItem);
    } else {
      navbarNav.appendChild(toggleLi);
    }

    // Bind event
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  }

  function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlEl.setAttribute('data-theme', newTheme);
    if (document.body) {
      if (newTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
    localStorage.setItem('site-theme', newTheme);
    
    const iconEl = document.getElementById('theme-toggle-icon');
    if (iconEl) {
      if (newTheme === 'dark') {
        iconEl.classList.remove('mdi-weather-sunny');
        iconEl.classList.add('mdi-weather-night');
      } else {
        iconEl.classList.remove('mdi-weather-night');
        iconEl.classList.add('mdi-weather-sunny');
      }
    }

    if (window.showToastNotification) {
      window.showToastNotification(`Tema ${newTheme === 'dark' ? 'Escuro' : 'Claro'} ativado.`);
    }
  }

  window.toggleSiteTheme = toggleTheme;
})();
