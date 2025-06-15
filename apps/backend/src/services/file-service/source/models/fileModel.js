const db = require('../db');

async function getAllFiles() {
  const { rows } = await db.query('SELECT * FROM files ORDER BY created_at DESC');
  return rows;
}

async function getFileById(id) {
  const { rows } = await db.query('SELECT * FROM files WHERE id = $1', [id]);
  return rows[0];
}

async function getFileByName(title){
  const { rows } = await db.query('SELECT * FROM files WHERE id = $1', [title]);
  return rows[0];
}

async function insertFile({ filename, mime_type, url, uploaded_by }) {
  const { rows } = await db.query(
    'INSERT INTO files (filename, mime_type, url, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
    [filename, mime_type, url, uploaded_by]
  );
  return rows[0];
}

async function deleteFile(id) {
  await db.query('DELETE FROM files WHERE id = $1', [id]);
}

module.exports = { getAllFiles, getFileById, getFileByName, insertFile, deleteFile };
