class NavbarComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .navbar {
          background-color: var(--azul-panel, #1B263B) !important;
          border-bottom: 1px solid #223047;
        }
        .navbar-nav .nav-link {
          color: var(--gris-claro, #D0D0D0) !important;
        }
        .navbar-nav .nav-link:hover {
          color: var(--azul-claro, #BBE1FA) !important;
        }
        .btn-outline-light:hover {
          background-color: var(--azul-acento, #3282B8);
        }
      </style>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/productos.html">
            <i class="bi bi-shop"></i> Mueblería Dashboard
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <span id="userInfo" class="navbar-text me-3"></span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light btn-sm" id="logoutBtn">
                  <i class="bi bi-box-arrow-right"></i> Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    // Obtener usuario desde JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.querySelector('#userInfo').textContent = `Bienvenido, ${payload.nombre}`;
    } catch (err) {
      console.error('Error decodificando token:', err);
    }

    // Logout
    this.querySelector('#logoutBtn').addEventListener('click', () => {
      Swal.fire({
        title: '¿Salir?',
        text: 'Se cerrará tu sesión',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
      });
    });
  }
}

customElements.define('navbar-component', NavbarComponent);

