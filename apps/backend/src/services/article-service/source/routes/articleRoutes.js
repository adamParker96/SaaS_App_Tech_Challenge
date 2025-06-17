const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const validateSanitize = require('../validation-sanitation/validationSanitation');
const { createArticleSchema, updateArticleSchema } = require('../validation-sanitation/schema');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/title/:title', articleController.getArticleByName);

router.post(
  '/',
  validateSanitize(createArticleSchema, { sanitize: ['title', 'content'] }),
  articleController.createArticle
);

router.put(
  '/:id',
  validateSanitize(updateArticleSchema, { sanitize: ['title', 'content'] }),
  articleController.updateArticle
);

router.delete('/:id', articleController.removeArticle);

module.exports = router;
