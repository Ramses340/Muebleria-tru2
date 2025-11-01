const detalleDao = require('../src/daos/detalleVenta.dao');
test('detalle DAO create placeholder', async () => {
  expect(typeof detalleDao.create).toBe('function');
});
