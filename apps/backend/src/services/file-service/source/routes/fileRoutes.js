const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');
const { validateCreateFile, validateUpdateFile } = require('../validation/fileValidation');

// Read
router.get('/name/:filename', controller.getByName);
router.get('/:id', controller.getById);
router.get('/', controller.getAll);

// Create
router.post('/', validateCreateFile, controller.upload);  //  Add validation middleware

// Update
router.put('/:id', validateUpdateFile, controller.update);

// Delete
router.delete('/:id', controller.remove);

module.exports = router;
