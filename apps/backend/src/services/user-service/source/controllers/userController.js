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


async function getUserByEmail(req, res) {
  const { email } = req.params;
  
  // Try cache first
  let user = await cache.get(`user:${email}`);
  if (user) {
    return res.json(JSON.parse(user));
  }

  user = await User.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Cache user
  await cache.set(`user:${email}`, JSON.stringify(user), { EX: 3600 }); // 1 hour expiry

  res.json(user);
}


async function createUser(req, res) {
  try {
    const user = await User.createUser(req.body);
    await cache.del('user:all');  //  new user in the house! destroy our old cache for 'all'
    await cache.del(`user:${req.params.id}`);  //  shouldn't be anything here, but it doesn't hurt to clear it
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
    await cache.del('user:all');  //  the queen is dead, long live the queen! destroy our old cache for 'all'
    await cache.del(`user:${req.params.id}`);  //  free up some cache space
    res.status(204).send();  //  success, no content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
}


async function updateUser(req, res) {
  try {
    const user = await User.updateUser(req.params.id, req.body);
    await cache.del('user:all');  //  updates have been made. destroy our old cache for 'all'
    await cache.del(`user:${req.params.id}`);  //  delete the old cached info for the user
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByEmail,
  createUser,
  deleteUser,
  updateUser
};
