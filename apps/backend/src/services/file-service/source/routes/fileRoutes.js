const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');

// Existing routes...
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.upload);
router.delete('/:id', controller.remove);
router.get('/name/:filename', controller.getByName);

module.exports = router;
