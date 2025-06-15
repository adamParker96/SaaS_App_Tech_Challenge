const db = require('../db');

async function getAllArticles() {
  const { rows } = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
  return rows;
}

async function getArticleById(id) {
  const { rows } = await db.query('SELECT * FROM articles WHERE id = $1', [id]);
  return rows[0];
}

async function getArticleByName(title) {
  const { rows } = await db.query('SELECT * FROM articles WHERE id = $1', [title]);
  return rows[0];
}

async function createArticle({ title, content, tags, author_id }) {
  const { rows } = await db.query(
    'INSERT INTO articles (title, content, tags, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, tags, author_id]
  );
  return rows[0];
}

async function updateArticle(id, data) {
  const { title, content, tags } = data;
  const { rows } = await db.query(
    `UPDATE articles SET title = $1, content = $2, tags = $3, updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [title, content, tags, id]
  );
  return rows[0];
}

async function deleteArticle(id) {
  await db.query('DELETE FROM articles WHERE id = $1', [id]);
}

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleByName,
  createArticle,
  updateArticle,
  deleteArticle,
};
