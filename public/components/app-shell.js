class AppShell extends HTMLElement {
  constructor() {
    super();
    this.currentPage = 'productos';
  }

  connectedCallback() {
    this.applyGlobalStyles();
    this.render();
    this.loadPage();
    this.setupRouter();
  }

  applyGlobalStyles() {
    // Aplicar estilos directamente al body y html
    document.body.style.backgroundColor = '#0D1B2A';
    document.body.style.color = '#F5F5F5';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.margin = '0';
    document.documentElement.style.backgroundColor = '#0D1B2A';
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }
        /* ===== PALETA DARK BLUE ELEGANTE ===== */
        :host {
          --azul-oscuro: #0D1B2A;
          --azul-panel: #1B263B;
          --azul-card: #27344D;
          --azul-acento: #3282B8;
          --azul-hover: #4A9FD8;
          --azul-claro: #BBE1FA;
          --gris-claro: #D0D0D0;
          --blanco: #F5F5F5;
        }
        #app-content {
          min-height: 100vh;
        }
      </style>
      <div id="app-content">
        <navbar-component></navbar-component>
        <div class="container-fluid mt-4">
          <div class="row">
            <div class="col-md-2">
              <sidebar-component></sidebar-component>
            </div>
            <div class="col-md-10">
              <div id="page-container"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupRouter() {
    // Detectar la ruta actual
    const path = window.location.pathname;
    
    if (path.includes('ventas')) {
      this.currentPage = 'ventas';
    } else if (path.includes('login')) {
      this.currentPage = 'login';
    } else if (path.includes('register')) {
      this.currentPage = 'register';
    } else {
      this.currentPage = 'productos';
    }

    this.loadPage();
  }

  async loadPage() {
    const container = this.querySelector('#page-container');
    
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    // Cargar componentes base primero
    await this.loadComponent('/components/navbar-component.js');
    await this.loadComponent('/components/sidebar-component.js');

    // Cargar el componente correspondiente
    if (this.currentPage === 'ventas') {
      container.innerHTML = '<ventas-manager></ventas-manager>';
      await this.loadComponent('/components/ventas-manager.js');
    } else {
      container.innerHTML = '<productos-manager></productos-manager>';
      await this.loadComponent('/components/productos-manager.js');
    }
  }

  async loadComponent(path) {
    // Evitar cargar el mismo componente dos veces
    const existing = document.querySelector(`script[src="${path}"]`);
    if (existing) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = path;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

customElements.define('app-shell', AppShell);

