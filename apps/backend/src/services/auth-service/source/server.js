const express = require("express");
const jwtCheck = require("./oktaAuth");

const app = express();

app.use(express.json());

app.get("/public", (req, res) => {
  res.send("This route is public.");
});

app.get("/protected", jwtCheck, (req, res) => {
  res.send("You have access to protected data!");
});

app.listen(4000, () => console.log("Server running on port 4000"));
