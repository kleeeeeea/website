async function includeComponents() {
  const includes = document.querySelectorAll('[data-include]');
  for (const node of includes) {
    const file = node.getAttribute('data-include');
    const base = node.getAttribute('data-base') || '';
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(file);
      let html = await response.text();
      html = html.replaceAll('{{base}}', base);
      node.innerHTML = html;
    } catch (error) {
      node.innerHTML = '<p>Navigation konnte nicht geladen werden.</p>';
      console.error('Include failed:', error);
    }
  }
}

function setupMenu() {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (!menuButton || !nav) return;

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupDropdowns() {
  const dropdownButtons = document.querySelectorAll('[data-dropdown-toggle]');
  dropdownButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.has-dropdown');
      if (!wrapper) return;
      wrapper.classList.toggle('open');
    });
  });
}

function markActiveLinks() {
  const currentPath = normalizePath(location.pathname);
  document.querySelectorAll('a[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const targetPath = normalizePath(new URL(href, location.href).pathname);
    if (targetPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function normalizePath(pathname) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized === '' ? '/index.html' : normalized;
}

function setYear() {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
}

async function boot() {
  await includeComponents();
  setupMenu();
  setupDropdowns();
  markActiveLinks();
  setYear();
}

boot();
