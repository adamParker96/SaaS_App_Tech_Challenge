const db = require('../db');

async function getAllFiles() {
  const { rows } = await db.query('SELECT * FROM files ORDER BY created_at DESC');
  return rows;
}

async function getFileById(id) {
  const { rows } = await db.query('SELECT * FROM files WHERE id = $1', [id]);
  return rows[0];
}

async function getFileByName(filename) {
  const { rows } = await db.query('SELECT * FROM files WHERE filename = $1', [filename]);
  return rows[0];
}

async function insertFile({ filename, mime_type, url, uploaded_by }) {
  const { rows } = await db.query(
    'INSERT INTO files (filename, mime_type, url, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
    [filename, mime_type, url, uploaded_by]
  );
  return rows[0];
}

async function updateFile(id, { filename, mime_type, url }) {
  const { rows } = await db.query(
    `UPDATE files 
     SET filename = $1, mime_type = $2, url = $3 
     WHERE id = $4 
     RETURNING *`,
    [filename, mime_type, url, id]
  );
  return rows[0];
}

async function deleteFile(id) {
  const result = await db.query('DELETE FROM files WHERE id = $1', [id]);
  return result.rowCount;
}

module.exports = {
  getAllFiles,
  getFileById,
  getFileByName,
  insertFile,
  updateFile,
  deleteFile,
};
