const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/detalleVenta.controller');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware'); // proteger si necesario

router.post('/',
  auth.protect,
  body('producto_id').isInt(),
  body('cantidad').isInt({ gt: 0 }),
  validate,
  ctrl.create
);

router.get('/', auth.protect, ctrl.getAll);
router.get('/venta/:venta_id', auth.protect, param('venta_id').isInt(), validate, ctrl.getByVenta);
router.get('/:id', auth.protect, param('id').isInt(), validate, ctrl.getOne);
router.put('/:id', auth.protect, param('id').isInt(), validate, ctrl.update);
router.delete('/:id', auth.protect, param('id').isInt(), validate, ctrl.delete);

module.exports = router;
