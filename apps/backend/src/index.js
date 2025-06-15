require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { oidc } = require('./config/okta');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const requireAuth = require('./middleware/requireAuth');

const app = express();
app.use(express.json());

app.use(session({
  secret: 'a-very-secret-key',
  resave: true,
  saveUninitialized: false,
}));

app.use(oidc.router);
app.use('/auth', authRoutes);
app.use('/articles', requireAuth, articleRoutes);

const PORT = process.env.PORT || 4000;
oidc.on('ready', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
oidc.on('error', err => {
  console.error('OIDC error: ', err);
});
