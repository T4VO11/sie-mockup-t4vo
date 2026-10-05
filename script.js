/* ============================================================
   Corporativo SIE
   Cargador + tema TweakCN + modo oscuro
   ============================================================ */
(function () {
  const root = document.documentElement;
  const STORAGE_KEY = 'sie-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme, persist) {
    const dark = theme === 'dark';
    root.classList.toggle('dark', dark);
    root.dataset.theme = dark ? 'dark' : 'light';

    if (persist) {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute(
        'aria-label',
        dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      btn.setAttribute(
        'title',
        dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    });
  }

  /* Aplicar el tema cuanto antes para reducir el flash visual. */
  applyTheme(getPreferredTheme(), false);

  /* Cargar estilos complementarios. */
  function loadStylesheet(href, id) {
    if (id && document.getElementById(id)) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = href;
    if (id) css.id = id;
    document.head.appendChild(css);
  }

  loadStylesheet('mobile-fix.css?v=1', 'sie-mobile-fix');
  loadStylesheet('theme.css?v=1', 'sie-tweakcn-theme');

  function themeButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sie-theme-toggle';
    btn.dataset.themeToggle = '';
    btn.innerHTML = `
      <svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3
                 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41
                 M17.66 17.66l1.41 1.41M2 12h2M20 12h2
                 M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
      </svg>`;
    btn.addEventListener('click', () => {
      applyTheme(root.classList.contains('dark') ? 'light' : 'dark', true);
    });
    return btn;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const actions = document.querySelector('.navbar__acciones');
    if (actions && !actions.querySelector('[data-theme-toggle]')) {
      actions.insertBefore(themeButton(), actions.firstChild);
    }

    /* Si la navbar de esta página no tiene .navbar__acciones,
       dejamos un botón dentro del menú móvil como respaldo. */
    if (!actions) {
      const mobileNav = document.querySelector('.nav-movil');
      if (mobileNav && !mobileNav.querySelector('[data-theme-toggle]')) {
        mobileNav.appendChild(themeButton());
      }
    }

    applyTheme(root.classList.contains('dark') ? 'dark' : 'light', false);
  });

  /* Seguir el tema del sistema mientras el usuario no haya elegido uno. */
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? 'dark' : 'light', false);
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  /* Mantener la lógica original del sitio. */
  const original = document.createElement('script');
  original.src = 'script-original.js?v=1';
  original.async = false;
  document.body.appendChild(original);
})();
