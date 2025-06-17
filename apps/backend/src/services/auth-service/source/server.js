const express = require("express");
const session = require("express-session");
const { Issuer, generators } = require("openid-client");
require("dotenv").config();

const app = express();
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

let client;

// Init OpenID client (run once)
(async () => {
  const oktaIssuer = await Issuer.discover(`${process.env.OKTA_ISSUER}`);
  client = new oktaIssuer.Client({
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uris: [process.env.OKTA_REDIRECT_URI],
    response_types: ["code"],
  });
})();

// Initiate login
app.get("/login", (req, res) => {
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  req.session.codeVerifier = codeVerifier;

  const authUrl = client.authorizationUrl({
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.redirect(authUrl);
});

// Callback from Okta
app.get("/callback", async (req, res, next) => {
  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    process.env.OKTA_REDIRECT_URI,
    params,
    { code_verifier: req.session.codeVerifier }
  );

  req.session.tokenSet = tokenSet;
  req.session.userinfo = await client.userinfo(tokenSet.access_token);

  res.redirect("/protected");
});

// Middleware to check auth
function requireAuth(req, res, next) {
  if (!req.session || !req.session.tokenSet) {
    return res.redirect("/login");
  }
  next();
}

app.get("/public", (req, res) => {
  res.send("This route is public.");
});

app.get("/protected", requireAuth, (req, res) => {
  res.send(`Hello ${req.session.userinfo.name}, you're authenticated!`);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("You have been logged out.");
});

app.listen(4000, () => console.log("Server running on port 6000"));
