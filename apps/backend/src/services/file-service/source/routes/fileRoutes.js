const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');
const { validateCreateFile, validateUpdateFile } = require('../validation/fileValidation');
const checkApiKey = require('../validation-sanitation/checkApiKey');


// Read
router.get('/name/:filename', controller.getByName);
router.get('/:id', controller.getById);
router.get('/', controller.getAll);

// Create
router.post('/', checkApiKey, validateCreateFile, controller.upload);  //  TODO: Add validation middleware

// Update
router.put('/:id', checkApiKey,validateUpdateFile, controller.update);

// Delete
router.delete('/:id', checkApiKey, controller.remove);

module.exports = router;
