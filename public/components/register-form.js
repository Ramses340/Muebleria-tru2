class RegisterForm extends HTMLElement {
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
        .reg-card {
          background: var(--card-blue, #162238);
          border: 1px solid var(--border-blue, #1e3050);
          border-radius: 12px;
          width: 400px;
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
        .eye-btn {
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .eye-btn:hover {
          transform: scale(1.2);
          opacity: 0.7;
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
        #strengthBar {
          height: 6px;
          border-radius: 4px;
          margin-top: 6px;
          transition: width 0.3s ease, background 0.3s ease;
        }
      </style>
      <div class="reg-card shadow p-4">
        <h3 class="text-center mb-3">Crear cuenta</h3>
        <form id="formRegistro" novalidate>
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" id="nombre" class="form-control" placeholder="Tu nombre" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Correo</label>
            <input type="email" id="email" class="form-control" placeholder="correo@example.com" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <div class="input-group">
              <input type="password" id="password" class="form-control" placeholder="Mínimo 8 caracteres" required>
              <span class="input-group-text eye-btn" id="togglePassword">
                <i class="bi bi-eye" id="iconPassword"></i>
              </span>
            </div>
            <div id="strengthBar"></div>
          </div>
          <button type="submit" class="btn btn-primary w-100" id="btnRegistrar">
            Registrarme
          </button>
        </form>
        <p class="text-center mt-3">
          ¿Ya tienes cuenta?
          <a href="/login.html">Iniciar sesión</a>
        </p>
      </div>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#formRegistro');
    const btnRegistrar = this.querySelector('#btnRegistrar');
    const togglePassword = this.querySelector('#togglePassword');
    const passwordInput = this.querySelector('#password');
    const iconPassword = this.querySelector('#iconPassword');
    const strengthBar = this.querySelector('#strengthBar');

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

    // Check password strength
    passwordInput.addEventListener('input', () => {
      this.checkStrength();
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = this.querySelector('#nombre').value.trim();
      const email = this.querySelector('#email').value.trim();
      const password = this.querySelector('#password').value.trim();

      if (!nombre || !email || !password) {
        Swal.fire('Campos incompletos', 'Llena todos los campos', 'warning');
        return;
      }

      btnRegistrar.disabled = true;
      btnRegistrar.innerText = 'Registrando...';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();

        if (res.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario registrado correctamente',
            text: 'Tu cuenta fue creada con éxito',
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            window.location.href = '/login.html';
          });
        } else {
          let errorMsg = data.message || 'No se pudo registrar';
          if (data.errors && Array.isArray(data.errors)) {
            errorMsg = data.errors.map(e => e.msg).join(', ');
          }
          Swal.fire('Error', errorMsg, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'No hay conexión con el servidor', 'error');
      }

      btnRegistrar.disabled = false;
      btnRegistrar.innerText = 'Registrarme';
    });
  }

  checkStrength() {
    const pass = this.querySelector('#password').value;
    const bar = this.querySelector('#strengthBar');

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    switch (strength) {
      case 0:
        bar.style.width = '0%';
        break;
      case 1:
        bar.style.width = '25%';
        bar.style.background = 'red';
        break;
      case 2:
        bar.style.width = '50%';
        bar.style.background = 'orange';
        break;
      case 3:
        bar.style.width = '75%';
        bar.style.background = 'gold';
        break;
      case 4:
        bar.style.width = '100%';
        bar.style.background = 'green';
        break;
    }
  }
}

customElements.define('register-form', RegisterForm);

