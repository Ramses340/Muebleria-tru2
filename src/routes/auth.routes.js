const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const ctrl = require('../controllers/auth.controller');

router.post('/login',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  validate,
  ctrl.login
);

// optional register for testing (creates plain password - replace by bcrypt in prod)
router.post('/register',
  body('username').isString().notEmpty(),
  body('password').isString().isLength({ min: 4 }),
  validate,
  ctrl.register
);

module.exports = router;
