const User = require('../models/userModel');
const cache = require('../cache');


async function getAllUsers(req, res) {
  // Try cache first
  let user = await cache.get(`user:all`);
  if (user) {
    return res.json(JSON.parse(user));
  }

  user = await User.getAllUsers();
  if (!user) return res.status(404).json({ error: 'Users not found' });

  // Cache users
  await cache.set(`user:all`, JSON.stringify(user), { EX: 3600 }); // 1 hour expiry

  res.json(user);
}


async function getUserByID(req, res) {
  const { id } = req.params;
  
  // Try cache first
  let user = await cache.get(`user:${id}`);
  if (user) {
    return res.json(JSON.parse(user));
  }

  user = await User.getUserByID(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Cache user
  await cache.set(`user:${id}`, JSON.stringify(user), { EX: 3600 }); // 1 hour expiry

  res.json(user);
}


async function getUserByName(req, res) {
  const { name } = req.params;
  
  // Try cache first
  let user = await cache.get(`user:${name}`);
  if (user) {
    return res.json(JSON.parse(user));
  }

  user = await User.getUserByName(name);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Cache user
  await cache.set(`user:${name}`, JSON.stringify(user), { EX: 3600 }); // 1 hour expiry

  res.json(user);
}


async function createUser(req, res) {
  try {
    const user = await User.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


async function deleteUser(req, res) {
  try {
    const deletedCount = await User.deleteUser(req.params.id);
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();  //  success, no content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}


async function updateUser(req, res) {
  try {
    const user = await User.updateUser(req.params.id, req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
