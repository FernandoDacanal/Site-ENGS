// Global Theme System Module
(function () {
  'use strict';

  // Apply saved theme immediately before DOMContentLoaded to prevent flickering
  const savedTheme = localStorage.getItem('site-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  function initThemeToggle() {
    const navbarNav = document.querySelector('.navbar-nav-right');
    if (!navbarNav) {
      // Retry in case navbar is loaded dynamically
      setTimeout(initThemeToggle, 200);
      return;
    }

    // Check if toggle already exists
    if (document.getElementById('theme-toggle-btn')) return;

    // Create toggle list item
    const toggleLi = document.createElement('li');
    toggleLi.className = 'nav-item d-none d-lg-block theme-toggle-item';
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const iconClass = currentTheme === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny';

    toggleLi.innerHTML = `
      <a class="nav-link" id="theme-toggle-btn" href="#" title="Alternar Tema">
        <i class="mdi ${iconClass}" id="theme-toggle-icon" style="font-size: 20px;"></i>
      </a>
    `;

    // Insert before the last logout button or settings button
    const logoutBtn = navbarNav.querySelector('.nav-logout') || navbarNav.querySelector('.nav-settings');
    if (logoutBtn) {
      navbarNav.insertBefore(toggleLi, logoutBtn);
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
    
    // Set attribute
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('site-theme', newTheme);
    
    // Update icon
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
  }
})();
