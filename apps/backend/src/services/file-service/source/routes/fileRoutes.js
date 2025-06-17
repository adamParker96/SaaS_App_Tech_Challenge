const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');

// Read
router.get('/name/:filename', controller.getByName);
router.get('/:id', controller.getById);
router.get('/', controller.getAll);

// Create
router.post('/', controller.upload); //  TODO: add middleware like multer for file handling

// Update
router.put('/:id', controller.update);

// Delete
router.delete('/:id', controller.remove);

module.exports = router;
