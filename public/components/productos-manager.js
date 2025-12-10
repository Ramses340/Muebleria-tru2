class ProductosManager extends HTMLElement {
  constructor() {
    super();
    this.token = localStorage.getItem('token');
    this.API_URL = '/api';
    this.currentEditProdId = null;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.verificarAuth();
    this.cargarProductos();
  }

  verificarAuth() {
    if (!this.token) {
      window.location.href = '/login.html';
      return;
    }
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          background-color: var(--azul-card, #27344D);
          color: var(--blanco, #F5F5F5);
          border: 1px solid #1f2c3d;
        }
        .card-header {
          background-color: var(--azul-panel, #1B263B);
          border-bottom: 1px solid #223047;
        }
        .form-control, .form-select {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 1px solid #2c3e50;
          border-radius: 6px;
        }
        table.table {
          background-color: #2E3F5F !important;
          color: var(--blanco, #F5F5F5) !important;
          border-radius: 12px !important;
          overflow: hidden;
          border: 1px solid #1f2c3d !important;
        }
        thead.table-dark th {
          background-color: #3B4F72 !important;
          color: var(--azul-claro, #BBE1FA) !important;
          border-color: #4B5E86 !important;
        }
        tbody tr {
          background-color: #2E3F5F !important;
          transition: background-color 0.25s ease;
        }
        tbody tr:hover {
          background-color: #4467A3 !important;
          color: var(--blanco, #F5F5F5) !important;
        }
        .table td, .table th {
          border-color: #1f2c3d !important;
          padding: 10px !important;
        }
        .btn-primary {
          background-color: var(--azul-acento, #3282B8);
          border-color: var(--azul-acento, #3282B8);
        }
        .btn-primary:hover {
          background-color: var(--azul-hover, #4A9FD8);
        }
        .btn-danger {
          background-color: #C62828;
          border-color: #C62828;
        }
        .btn-danger:hover {
          background-color: #E53935;
        }
        .btn-warning {
          background-color: #F57C00;
          border-color: #F57C00;
        }
        .modal-content {
          background-color: var(--azul-panel, #1B263B);
          color: var(--blanco, #F5F5F5);
          border: 1px solid #223047;
        }
        .modal-header, .modal-footer {
          border-color: #223047;
        }
      </style>
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="bi bi-box2"></i> Gestionar Productos</h5>
        </div>
        <div class="card-body">
          <!-- Formulario crear/editar -->
          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="prodNombre" class="form-control" placeholder="Ej: Silla">
            </div>
            <div class="col-md-3">
              <label class="form-label">Precio</label>
              <input type="number" id="prodPrecio" class="form-control" placeholder="Ej: 150.50" step="0.01">
            </div>
            <div class="col-md-3">
              <label class="form-label">Stock</label>
              <input type="number" id="prodStock" class="form-control" placeholder="Ej: 10" min="0">
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-success w-100" id="btnGuardarProducto">
                <i class="bi bi-plus-circle"></i> Guardar
              </button>
            </div>
          </div>

          <!-- Tabla de productos -->
          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="productosTable">
                <tr><td colspan="5" class="text-center text-muted">Cargando...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Gráficas: Stock y Precios -->
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card p-3">
                <h6 class="mb-2">Productos en Stock</h6>
                <canvas id="stockChart" width="400" height="260" style="width:100%;height:260px;"></canvas>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-3">
                <h6 class="mb-2">Producto con Mayor Precio</h6>
                <canvas id="priceChart" width="400" height="260" style="width:100%;height:260px;"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para editar producto -->
      <div class="modal fade" id="editProdModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Producto</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="editProdId">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" id="editProdNombre" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input type="number" id="editProdPrecio" class="form-control" step="0.01">
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input type="number" id="editProdStock" class="form-control" min="0">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnActualizarProducto">Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    this.querySelector('#btnGuardarProducto').addEventListener('click', () => this.guardarProducto());
    this.querySelector('#btnActualizarProducto').addEventListener('click', () => this.actualizarProducto());
  }

  async cargarProductos() {
    try {
      const res = await fetch(`${this.API_URL}/productos`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Error al cargar productos');
      
      const productos = await res.json();
      this.renderProductosTable(productos);
      this.renderCharts(productos);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      this.querySelector('#productosTable').innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar</td></tr>';
    }
  }

  renderProductosTable(productos) {
    const table = this.querySelector('#productosTable');
    
    if (productos.length === 0) {
      table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay productos</td></tr>';
      return;
    }

    table.innerHTML = productos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>$${parseFloat(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <div class="action-buttons d-flex" style="gap: 5px;">
            <button class="btn btn-sm btn-warning btn-edit-prod" data-id="${p.id}" data-nombre="${p.nombre.replace(/"/g, '&quot;')}" data-precio="${p.precio}" data-stock="${p.stock}">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger btn-delete-prod" data-id="${p.id}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach event listeners to buttons
    table.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        const stock = parseInt(btn.dataset.stock);
        this.abrirEditProd(id, nombre, precio, stock);
      });
    });

    table.querySelectorAll('.btn-delete-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.eliminarProducto(id);
      });
    });
  }

  async guardarProducto() {
    const nombre = this.querySelector('#prodNombre').value.trim();
    const precio = parseFloat(this.querySelector('#prodPrecio').value);
    const stock = parseInt(this.querySelector('#prodStock').value);

    if (!nombre || !precio || isNaN(stock)) {
      Swal.fire('Error', 'Completa todos los campos correctamente', 'warning');
      return;
    }

    try {
      const res = await fetch(`${this.API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ nombre, precio, stock })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear producto');
      }

      Swal.fire('Éxito', 'Producto creado correctamente', 'success');
      this.querySelector('#prodNombre').value = '';
      this.querySelector('#prodPrecio').value = '';
      this.querySelector('#prodStock').value = '';
      this.cargarProductos();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  abrirEditProd(id, nombre, precio, stock) {
    this.currentEditProdId = id;
    this.querySelector('#editProdId').value = id;
    this.querySelector('#editProdNombre').value = nombre;
    this.querySelector('#editProdPrecio').value = precio;
    this.querySelector('#editProdStock').value = stock;
    new bootstrap.Modal(this.querySelector('#editProdModal')).show();
  }

  async actualizarProducto() {
    const id = this.currentEditProdId;
    const nombre = this.querySelector('#editProdNombre').value.trim();
    const precio = parseFloat(this.querySelector('#editProdPrecio').value);
    const stock = parseInt(this.querySelector('#editProdStock').value);

    if (!nombre || !precio || isNaN(stock)) {
      Swal.fire('Error', 'Completa todos los campos', 'warning');
      return;
    }

    try {
      const res = await fetch(`${this.API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ nombre, precio, stock })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Éxito', 'Producto actualizado', 'success');
      bootstrap.Modal.getInstance(this.querySelector('#editProdModal')).hide();
      this.cargarProductos();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  async eliminarProducto(id) {
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${this.API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar');

      Swal.fire('Éxito', 'Producto eliminado', 'success');
      this.cargarProductos();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  renderCharts(productos) {
    try {
      if (!Array.isArray(productos)) return;
      const labels = productos.map(p => p.nombre);
      const stocks = productos.map(p => Number(p.stock || 0));
      const prices = productos.map(p => Number(p.precio || 0));

      this.drawBarChart('stockChart', labels, stocks, { color: '#4CAF50', title: 'Stock por Producto' });

      const maxPrice = Math.max(...prices);
      const maxIndex = prices.indexOf(maxPrice);
      this.drawBarChart('priceChart', labels, prices, { color: '#2196F3', highlightIndex: maxIndex, highlightColor: '#FF5722', title: 'Precio por Producto' });
    } catch (e) {
      console.error('Error renderCharts', e);
    }
  }

  drawBarChart(canvasId, labels, values, opts = {}) {
    const canvas = this.querySelector(`#${canvasId}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    ctx.clearRect(0, 0, w, h);

    const padding = 90;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;

    const maxVal = Math.max(1, ...values);
    const barGap = 8;
    const barWidth = Math.max(6, (chartW - (labels.length - 1) * barGap) / labels.length);

    if (opts.title) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(opts.title, padding, 16);
    }

    labels.forEach((lbl, i) => {
      const val = values[i] || 0;
      const x = padding + i * (barWidth + barGap);
      const barH = (val / maxVal) * (chartH - 30);
      const y = padding + (chartH - barH) + 12;

      let color = opts.color || '#4CAF50';
      if (typeof opts.highlightIndex === 'number' && i === opts.highlightIndex) {
        color = opts.highlightColor || '#FF5722';
      }

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(String(val), x + barWidth / 2, y - 6);

      ctx.save();
      ctx.translate(x + barWidth / 2, padding + chartH + 28);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#dde6f6';
      ctx.font = '11px Arial';
      const shortLabel = lbl.length > 18 ? lbl.slice(0, 16) + '…' : lbl;
      ctx.fillText(shortLabel, 0, 0);
      ctx.restore();
    });
  }
}

customElements.define('productos-manager', ProductosManager);

