class VentasManager extends HTMLElement {
  constructor() {
    super();
    this.token = localStorage.getItem('token');
    this.API_URL = '/api';
    this.currentEditDetId = null;
    this.productosDisponibles = [];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.verificarAuth();
    this.cargarProductosEnSelect();
    this.cargarDetallesVenta();
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
        .alert-light {
          background-color: #f8f9fa;
          color: #000;
        }
      </style>
      <div class="card">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0"><i class="bi bi-receipt"></i> Crear Detalle de Venta (Ticket)</h5>
        </div>
        <div class="card-body">
          <!-- Formulario crear detalle de venta -->
          <div class="row mb-4">
            <div class="col-md-3">
              <label class="form-label"><strong>Venta ID</strong></label>
              <input type="number" id="detVentaId" class="form-control" placeholder="Ej: 1" min="1">
            </div>
            <div class="col-md-4">
              <label class="form-label"><strong>Seleccionar Producto</strong></label>
              <select id="detProductoSelect" class="form-select">
                <option value="">-- Selecciona un producto --</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label"><strong>Cantidad</strong></label>
              <input type="number" id="detCantidad" class="form-control" placeholder="Ej: 2" min="1" value="1">
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-success w-100" id="btnGuardarDetalle">
                <i class="bi bi-plus-circle"></i> Agregar a Venta
              </button>
            </div>
          </div>

          <!-- Información del producto seleccionado -->
          <div id="productoInfoDiv" class="alert alert-light border mb-4" style="display: none;">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-primary"><strong>Producto:</strong> <span id="infoProdNombre"></span></h6>
                <p class="mb-2"><strong>Descripción:</strong> <span id="infoProdDesc" class="text-muted"></span></p>
              </div>
              <div class="col-md-6">
                <p class="mb-2"><strong>Precio Unitario:</strong> $<span id="infoProdPrecio" class="text-success fw-bold"></span></p>
                <p class="mb-2"><strong>Stock Disponible:</strong> <span id="infoProdStock" class="badge bg-secondary"></span></p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-info">Subtotal: $<span id="infoProdSubtotal" class="fw-bold">0.00</span></h6>
              </div>
            </div>
          </div>

          <!-- Tabla de detalles de venta (como recibo) -->
          <h5 class="mt-5 mb-3"><i class="bi bi-receipt-cutoff"></i> Detalles de Ventas Registrados</h5>
          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Venta ID</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="detalleVentaTable">
                <tr><td colspan="8" class="text-center text-muted">Cargando...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal para editar detalle venta -->
      <div class="modal fade" id="editDetModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Detalle de Venta</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="editDetId">
              <div class="mb-3">
                <label class="form-label">Cantidad</label>
                <input type="number" id="editDetCantidad" class="form-control" min="1">
              </div>
              <div class="mb-3">
                <label class="form-label">Precio Unitario</label>
                <input type="number" id="editDetPrecioUnitario" class="form-control" step="0.01">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnActualizarDetalle">Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    this.querySelector('#btnGuardarDetalle').addEventListener('click', () => this.guardarDetalleVenta());
    this.querySelector('#btnActualizarDetalle').addEventListener('click', () => this.actualizarDetalleVenta());
    
    const productoSelect = this.querySelector('#detProductoSelect');
    const cantidadInput = this.querySelector('#detCantidad');
    
    productoSelect.addEventListener('change', () => this.cargarDetallesProducto());
    cantidadInput.addEventListener('change', () => this.calcularSubtotal());
  }

  async cargarProductosEnSelect() {
    try {
      const res = await fetch(`${this.API_URL}/productos`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Error al cargar productos');
      
      this.productosDisponibles = await res.json();
      const select = this.querySelector('#detProductoSelect');
      select.innerHTML = '<option value="">-- Selecciona un producto --</option>';
      
      this.productosDisponibles.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.nombre} - $${parseFloat(p.precio).toFixed(2)}`;
        select.appendChild(option);
      });
    } catch (err) {
      console.error(err);
    }
  }

  cargarDetallesProducto() {
    const productoId = parseInt(this.querySelector('#detProductoSelect').value);
    const infoDiv = this.querySelector('#productoInfoDiv');
    
    if (!productoId) {
      infoDiv.style.display = 'none';
      return;
    }

    const producto = this.productosDisponibles.find(p => p.id === productoId);
    if (!producto) return;

    this.querySelector('#infoProdNombre').textContent = producto.nombre;
    this.querySelector('#infoProdDesc').textContent = producto.descripcion || 'Sin descripción';
    this.querySelector('#infoProdPrecio').textContent = parseFloat(producto.precio).toFixed(2);
    this.querySelector('#infoProdStock').textContent = producto.stock;
    
    infoDiv.style.display = 'block';
    this.calcularSubtotal();
  }

  calcularSubtotal() {
    const productoId = parseInt(this.querySelector('#detProductoSelect').value);
    const cantidad = parseInt(this.querySelector('#detCantidad').value) || 1;
    
    if (!productoId) return;

    const producto = this.productosDisponibles.find(p => p.id === productoId);
    if (!producto) return;

    const subtotal = parseFloat(producto.precio) * cantidad;
    this.querySelector('#infoProdSubtotal').textContent = subtotal.toFixed(2);
  }

  async cargarDetallesVenta() {
    try {
      const res = await fetch(`${this.API_URL}/detalleVenta`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Error al cargar detalles');
      
      const detalles = await res.json();
      this.renderDetalleVentaTable(detalles);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los detalles de venta', 'error');
      this.querySelector('#detalleVentaTable').innerHTML = '<tr><td colspan="8" class="text-danger">Error al cargar</td></tr>';
    }
  }

  renderDetalleVentaTable(detalles) {
    const table = this.querySelector('#detalleVentaTable');
    
    if (!Array.isArray(detalles) || detalles.length === 0) {
      table.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay detalles de venta</td></tr>';
      return;
    }

    table.innerHTML = detalles.map(d => {
      const producto = this.productosDisponibles.find(p => p.id === d.producto_id);
      const subtotal = parseFloat(d.precio_unitario) * d.cantidad;
      
      return `
        <tr>
          <td><strong>${d.id}</strong></td>
          <td>${d.venta_id}</td>
          <td>${producto ? producto.nombre : `Producto #${d.producto_id}`}</td>
          <td class="text-muted small">${producto ? producto.descripcion : 'N/A'}</td>
          <td class="text-center"><badge class="badge bg-info">${d.cantidad}</badge></td>
          <td>$${parseFloat(d.precio_unitario).toFixed(2)}</td>
          <td><strong>$${subtotal.toFixed(2)}</strong></td>
          <td>
            <div class="action-buttons d-flex" style="gap: 5px;">
              <button class="btn btn-sm btn-warning btn-edit-det" data-id="${d.id}" data-cantidad="${d.cantidad}" data-precio="${d.precio_unitario}">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger btn-delete-det" data-id="${d.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach event listeners to buttons
    table.querySelectorAll('.btn-edit-det').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const cantidad = parseInt(btn.dataset.cantidad);
        const precio = parseFloat(btn.dataset.precio);
        this.abrirEditDet(id, cantidad, precio);
      });
    });

    table.querySelectorAll('.btn-delete-det').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.eliminarDetalleVenta(id);
      });
    });
  }

  async guardarDetalleVenta() {
    const venta_id = parseInt(this.querySelector('#detVentaId').value);
    const producto_id = parseInt(this.querySelector('#detProductoSelect').value);
    const cantidad = parseInt(this.querySelector('#detCantidad').value);
    
    const producto = this.productosDisponibles.find(p => p.id === producto_id);
    if (!producto) {
      Swal.fire('Error', 'Selecciona un producto válido', 'warning');
      return;
    }

    const precio_unitario = parseFloat(producto.precio);

    if (isNaN(producto_id) || isNaN(cantidad) || isNaN(precio_unitario)) {
      Swal.fire('Error', 'Selecciona producto y cantidad válidos', 'warning');
      return;
    }

    if (cantidad > producto.stock) {
      Swal.fire('Error', `No hay suficiente stock. Disponible: ${producto.stock}`, 'warning');
      return;
    }

    try {
      const body = { producto_id, cantidad };
      if (!isNaN(venta_id)) body.venta_id = venta_id;

      const res = await fetch(`${this.API_URL}/detalleVenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear');
      }

      const created = await res.json();
      Swal.fire('Éxito', `${producto.nombre} agregado a la venta`, 'success');
      if (created && created.venta_id) {
        this.querySelector('#detVentaId').value = created.venta_id;
      } else {
        this.querySelector('#detVentaId').value = '';
      }
      this.querySelector('#detProductoSelect').value = '';
      this.querySelector('#detCantidad').value = '1';
      this.querySelector('#productoInfoDiv').style.display = 'none';
      this.cargarDetallesVenta();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  abrirEditDet(id, cantidad, precio_unitario) {
    this.currentEditDetId = id;
    this.querySelector('#editDetId').value = id;
    this.querySelector('#editDetCantidad').value = cantidad;
    this.querySelector('#editDetPrecioUnitario').value = precio_unitario;
    new bootstrap.Modal(this.querySelector('#editDetModal')).show();
  }

  async actualizarDetalleVenta() {
    const id = this.currentEditDetId;
    const cantidad = parseInt(this.querySelector('#editDetCantidad').value);
    const precio_unitario = parseFloat(this.querySelector('#editDetPrecioUnitario').value);

    if (isNaN(cantidad) || isNaN(precio_unitario)) {
      Swal.fire('Error', 'Completa los campos', 'warning');
      return;
    }

    try {
      const res = await fetch(`${this.API_URL}/detalleVenta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ cantidad, precio_unitario })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Éxito', 'Detalle actualizado', 'success');
      bootstrap.Modal.getInstance(this.querySelector('#editDetModal')).hide();
      this.cargarDetallesVenta();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  async eliminarDetalleVenta(id) {
    const confirm = await Swal.fire({
      title: '¿Eliminar detalle?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${this.API_URL}/detalleVenta/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Error al eliminar');

      Swal.fire('Éxito', 'Detalle eliminado', 'success');
      this.cargarDetallesVenta();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}

customElements.define('ventas-manager', VentasManager);

