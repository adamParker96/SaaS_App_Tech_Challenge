//  This script controls access to Articles

const Article = require('../models/articleModel');
const cache = require('../cache');

exports.getAllArticles = async (req, res) => {  //  get All articles function - pulls 60 articles (by default), for use on the Home Page
    const article = await Article.getAllArticles()
    res.json(article.rows);
};

exports.getArticleById = async (req, res) => {  //  get a specific article via its ID
  const { id } = req.params;
  const cached = await cache.get(`article:${id}`);
  if (cached) return res.json(JSON.parse(cached));
  
  const article = await Article.getArticleById(id);
  if (!article) return res.status(404).send("Not found");
  
  await cache.set(`article:${id}`, JSON.stringify(article), { EX: 3600 });
  res.json(article);
  };

exports.getArticleByName = async (req, res) => {  //  get a specific article via its title
  const { title } = req.params;
  const cached = await cache.get(`article:${title}`);
  if (cached) return res.json(JSON.parse(cached));

  const article = await Article.getArticleByName(title)
  if (!article) return res.status(404).send("Not found");

  await cache.set(`article:${id}`, JSON.stringify(article), { EX: 3600 });
  res.json(article);
};

exports.createArticle = async (req, res) => {
  const article = await Article.createArticle(req.body);
  res.status(201).json(article);
};

exports.updateArticle = async (req, res) => {
  const updated = await Article.updateArticle(req.params.id, req.body);
  res.json(updated);
};

exports.removeArticle = async (req, res) => {
  await Article.deleteArticle(req.params.id);
  res.sendStatus(204);
};
