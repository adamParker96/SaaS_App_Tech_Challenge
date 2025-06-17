const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');

// Read
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/name/:filename', controller.getByName);

// Create
router.post('/', controller.upload); // assumes middleware like multer for file handling

// Update
router.put('/:id', controller.update);

// Delete
router.delete('/:id', controller.remove);

module.exports = router;
