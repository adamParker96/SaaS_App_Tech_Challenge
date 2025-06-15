//  This microservice controls access to Articles

const pool = require('../config/db');
const redis = require('../config/redis');

exports.getAllArticles = async (req, res) => {  //  get All articles function - pulls 60 articles (by default), for use on the Home Page
  try {
    const cache = await redis.get('all_articles');  //  check Redis to see if user has this data
    if (cache) {
      return res.json(JSON.parse(cache));
    }

    const result = await pool.query('SELECT id, title, summary FROM articles LIMIT 60');  //  query our DB (pool) for 60 articles, and their id, title, and summaries
    redis.set('all_articles', JSON.stringify(result.rows), 'EX', 60);  //  update Redis
    res.json(result.rows);
  } catch (err) {  //  error handling
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getArticleById = async (req, res) => {  //  get a specific article via its ID
  const { id } = req.params;

  try {
    const cache = await redis.get(`article:${id}`);
    if (cache) return res.json(JSON.parse(cache));

    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });

    redis.set(`article:${id}`, JSON.stringify(result.rows[0]), 'EX', 60);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getArticleByName = async (req, res) => {  //  get a specific article via its title
  const { title } = req.params;

  try {
    const cache = await redis.get(`article:${title}`);
    if (cache) return res.json(JSON.parse(cache));

    const result = await pool.query('SELECT * FROM articles WHERE title = $1', [title]);
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' });

    redis.set(`article:${title}`, JSON.stringify(result.rows[0]), 'EX', 60);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.create = async (req, res) => {
  const article = await Article.createArticle(req.body);
  res.status(201).json(article);
};

exports.update = async (req, res) => {
  const updated = await Article.updateArticle(req.params.id, req.body);
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Article.deleteArticle(req.params.id);
  res.sendStatus(204);
};
