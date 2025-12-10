class SidebarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const currentPage = window.location.pathname;
    const isProductos = currentPage.includes('productos') || (!currentPage.includes('ventas') && !currentPage.includes('login') && !currentPage.includes('register'));
    const isVentas = currentPage.includes('ventas');

    this.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .list-group-item {
          background-color: var(--azul-panel, #1B263B);
          border: 1px solid #223047;
          color: var(--blanco, #F5F5F5);
          cursor: pointer;
        }
        .list-group-item.active {
          background-color: var(--azul-acento, #3282B8);
          border-color: var(--azul-acento, #3282B8);
        }
        .list-group-item:hover {
          background-color: var(--azul-card, #27344D);
        }
      </style>
      <div class="list-group sticky-top">
        <a href="/productos.html" class="list-group-item list-group-item-action ${isProductos ? 'active' : ''}">
          <i class="bi bi-box2"></i> Productos
        </a>
        <a href="/ventas.html" class="list-group-item list-group-item-action ${isVentas ? 'active' : ''}">
          <i class="bi bi-receipt"></i> Ventas
        </a>
      </div>
    `;
  }

  attachEventListeners() {
    // La navegación se maneja con los enlaces <a>
  }
}

customElements.define('sidebar-component', SidebarComponent);

