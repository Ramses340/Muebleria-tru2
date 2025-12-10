class AuthPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const isLogin = window.location.pathname.includes('login') || window.location.pathname === '/' || window.location.pathname === '/index.html';
    
    // Aplicar estilos al body
    document.body.style.backgroundColor = '#0d1117';
    document.body.style.color = '#ffffff';
    document.body.className = 'd-flex align-items-center justify-content-center vh-100';
    
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }
        :host {
          --bg-dark: #0d1117;
          --card-blue: #162238;
          --border-blue: #1e3050;
          --blue-primary: #1f4ea3;
          --blue-hover: #275fcc;
          --text-white: #ffffff;
        }
      </style>
      ${isLogin ? '<login-form></login-form>' : '<register-form></register-form>'}
    `;

    // Cargar el componente correspondiente
    const componentPath = isLogin ? '/components/login-form.js' : '/components/register-form.js';
    this.loadComponent(componentPath);
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

customElements.define('auth-page', AuthPage);

