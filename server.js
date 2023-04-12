const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});