const express = require('express');
const router = express.Router();
const { createUserSchema, updateUserSchema } = require('../schemas/userSchema');
const validateSanitize = require('../validation-sanitation/validationSanitation');
const checkApiKey = require('../validation-sanitation/checkApiKey');

const {
  getAllUsers,
  getUserByID,
  getUserByEmail,
  createUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');


//  GET /users - Get all users 
router.get('/', getAllUsers);

//  GET /users/id/:id - Get user by ID 
router.get('/id/:id', getUserByID);

//  GET /users/name/:name - Get user by email
router.get('/email/:email', getUserByEmail);

//  POST /users - Create a new user
router.post(
  '/',
  checkApiKey,
  validateSanitize(createUserSchema, { sanitize: ['name', 'email'] }),
  createUser
);

//  PUT /users/:id - Update a user
router.put(
  '/:id',
  checkApiKey,
  validateSanitize(updateUserSchema, { sanitize: ['name', 'email'] }),
  updateUser
);

// DELETE  /users/:id - Delete a user
router.delete('/:id', checkApiKey, deleteUser);

module.exports = router;
