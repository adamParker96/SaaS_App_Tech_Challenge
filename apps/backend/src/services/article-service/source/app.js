const express = require('express');
const cors = require('cors');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/articles', articleRoutes);

module.exports = app;
