const express = require('express');
const router = express.Router();
const controller = require('../controllers/colaboradorController');

router.get('/', controller.getColaboradores);
router.post('/', controller.createColaborador);
router.put('/:id', controller.updateColaborador);
router.delete('/:id', controller.deleteColaborador);

module.exports = router;
