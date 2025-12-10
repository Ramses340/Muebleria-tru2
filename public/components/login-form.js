class LoginForm extends HTMLElement {
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
        .login-card {
          background: var(--card-blue, #162238);
          border: 1px solid var(--border-blue, #1e3050);
          border-radius: 12px;
          color: var(--text-white, #ffffff);
        }
        .form-control {
          background-color: #ffffff !important;
          color: #000 !important;
          border-radius: 8px;
          border: 1px solid var(--border-blue, #1e3050);
        }
        .form-control::placeholder {
          color: #6f6f6f !important;
        }
        .input-group-text {
          background-color: #ffffff !important;
          border: 1px solid var(--border-blue, #1e3050);
          border-radius: 8px;
          cursor: pointer;
        }
        .eye-btn i {
          color: #000 !important;
        }
        .btn-primary {
          background-color: var(--blue-primary, #1f4ea3);
          border: none;
          font-weight: 600;
          border-radius: 8px;
        }
        .btn-primary:hover {
          background-color: var(--blue-hover, #275fcc);
        }
        a {
          color: #69a8ff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
      <div class="login-card shadow p-4" style="max-width:420px; width:100%;">
        <h3 class="text-center mb-3">Iniciar Sesión</h3>
        <form id="loginForm" novalidate>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input id="email" class="form-control" type="email" placeholder="Ingresa tu email" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <div class="input-group">
              <input id="password" class="form-control" type="password" placeholder="Ingresa tu contraseña" required>
              <span class="input-group-text eye-btn" id="togglePassword">
                <i class="bi bi-eye" id="iconPassword"></i>
              </span>
            </div>
          </div>
          <button class="btn btn-primary w-100" type="submit" id="btnLogin">
            Entrar
          </button>
        </form>
        <div class="mt-3 text-center">
          <a href="/register.html">Crear cuenta</a>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#loginForm');
    const btnLogin = this.querySelector('#btnLogin');
    const togglePassword = this.querySelector('#togglePassword');
    const passwordInput = this.querySelector('#password');
    const iconPassword = this.querySelector('#iconPassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconPassword.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        passwordInput.type = 'password';
        iconPassword.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = this.querySelector('#email').value.trim();
      const password = this.querySelector('#password').value.trim();

      if (!email || !password) {
        Swal.fire('Campos incompletos', 'Llena todos los campos', 'warning');
        return;
      }

      btnLogin.disabled = true;
      btnLogin.innerHTML = 'Entrando...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          let errorMsg = data.message || 'Error en el login';
          if (data.errors && Array.isArray(data.errors)) {
            errorMsg = data.errors.map(e => e.msg).join(', ');
          }
          Swal.fire('Error', errorMsg, 'error');
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión correcto',
            text: 'Bienvenido ' + data.user.nombre,
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            localStorage.setItem('token', data.token);
            window.location.href = '/productos.html';
          });
        }
      } catch (err) {
        Swal.fire('Error', 'No hay conexión con el servidor', 'error');
      }

      btnLogin.disabled = false;
      btnLogin.innerHTML = 'Entrar';
    });
  }
}

customElements.define('login-form', LoginForm);

