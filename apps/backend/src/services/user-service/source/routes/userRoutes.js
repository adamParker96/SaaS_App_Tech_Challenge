const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserByID,
  getUserByName,
  createUser,
  deleteUser,
  updateUser
} = require('../models/userModel'); // adjust path if needed

// GET /users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/id/:id - get user by ID
router.get('/id/:id', async (req, res) => {
  try {
    const user = await getUserByID(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user by ID' });
  }
});

// GET /users/name/:name - get user by name
router.get('/name/:name', async (req, res) => {
  try {
    const user = await getUserByName(req.params.name);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user by name' });
  }
});

// POST /users - create a new user
router.post('/', async (req, res) => {
  const { name, id, email } = req.body;
  try {
    const newUser = await createUser({ name, id, email });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// DELETE /users/:id - delete a user
router.delete('/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PUT /users/:id - update a user
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await updateUser(req.params.id, { name, email });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
