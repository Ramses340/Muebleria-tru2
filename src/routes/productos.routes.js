const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/producto.controller');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

router.post('/',
  auth.protect,
  body('nombre').isString().notEmpty(),
  body('precio').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  validate,
  ctrl.create
);

router.get('/', auth.protect, ctrl.getAll);
router.get('/:id', auth.protect, param('id').isInt(), validate, ctrl.getOne);
router.put('/:id', auth.protect,
  param('id').isInt(),
  body('nombre').optional().isString(),
  body('precio').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  validate,
  ctrl.update
);
router.delete('/:id', auth.protect, param('id').isInt(), validate, ctrl.delete);

module.exports = router;
