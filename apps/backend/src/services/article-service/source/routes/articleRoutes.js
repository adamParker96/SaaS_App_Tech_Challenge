const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const validateSanitize = require('../validation-sanitation/validationSanitation');
const { createArticleSchema, updateArticleSchema } = require('../validation-sanitation/schema');
const checkApiKey = require('../validation-sanitation/checkApiKey');


router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/title/:title', articleController.getArticleByName);

router.post(
  '/',
  checkApiKey,
  validateSanitize(createArticleSchema, { sanitize: ['title', 'content'] }),
  articleController.createArticle
);

router.put(
  '/:id',
  checkApiKey,
  validateSanitize(updateArticleSchema, { sanitize: ['title', 'content'] }),
  articleController.updateArticle
);

router.delete('/:id', checkApiKey, articleController.removeArticle);

module.exports = router;
