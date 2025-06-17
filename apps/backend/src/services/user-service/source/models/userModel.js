const db = require('../db');

async function getAllUsers() {
  const { rows } = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
}

async function getUserByID(id) {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function getUserByEmail(email){
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
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
  const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount  //  returns # of rows deleted (0 or 1)
}

async function updateUser(id, { name, email }) {
  const { rows } = await db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]
  );
  return rows[0];
}

module.exports = { getAllUsers, getUserByID, getUserByEmail, createUser, deleteUser, updateUser };
