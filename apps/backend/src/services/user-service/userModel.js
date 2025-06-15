const db = require('../db');

async function getAllUsers() {
  const { rows } = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
}

async function getUserByID(id) {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function getUserByName(name){
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [title]);
  return rows[0];
}

async function createUser({ name, id, email}) {
  const { rows } = await db.query(
    'INSERT INTO users (name, id, email) VALUES ($1, $2, $3) RETURNING *',
    [name, id, email]
  );
  return rows[0];
}

async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
}

module.exports = { getAllUsers, getUserByID, getUserByName, createUser, deleteUser, updateUser };
