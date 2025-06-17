const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/files', fileRoutes);

module.exports = app;
