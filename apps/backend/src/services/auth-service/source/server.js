const express = require("express");
const session = require("express-session");
const { Issuer, generators } = require("openid-client");
const RedisStore = require("connect-redis").default;
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
app.use(express.json());

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT) || 6379
});

// Secure session setup
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // requires HTTPS in production
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

let client;

// Init OpenID client (run once)
(async () => {
  try {
    const oktaIssuer = await Issuer.discover(process.env.OKTA_ISSUER);
    client = new oktaIssuer.Client({
      client_id: process.env.OKTA_CLIENT_ID,
      client_secret: process.env.OKTA_CLIENT_SECRET,
      redirect_uris: [process.env.OKTA_REDIRECT_URI],
      response_types: ["code"]
    });
    console.log("OIDC client initialized.");
  } catch (err) {
    console.error("Failed to initialize OIDC client:", err);
  }
})();

// Login endpoint — uses PKCE
app.get("/login", (req, res) => {
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  req.session.codeVerifier = codeVerifier;

  const authUrl = client.authorizationUrl({
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  res.redirect(authUrl);
});

// Okta callback
app.get("/callback", async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      process.env.OKTA_REDIRECT_URI,
      params,
      { code_verifier: req.cookies.codeVerifier } // or URL param/state
    );

    // Optional: create a custom JWT here if you don't want to use Okta's ID token
    // const jwt = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.cookie("id_token", tokenSet.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000
    });

    res.redirect(process.env.FRONTEND_URL); // redirect to your React app
  } catch (err) {
    console.error("OIDC callback error:", err);
    res.status(500).send("Authentication failed.");
  }
});

// Middleware to protect routes
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
  req.session.destroy(() => {
    res.send("You have been logged out.");
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("You have been logged out.");
});

app.listen(6000, () => console.log("Server running on port 6000"));
