require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`File service running on port ${PORT}`);
});
