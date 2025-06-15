const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const oktaIssuer = process.env.OKTA_ISSUER;
const oktaAudience = process.env.OKTA_AUDIENCE;

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${oktaIssuer}/v1/keys`,
  }),
  audience: oktaAudience,
  issuer: oktaIssuer,
  algorithms: ["RS256"],
});

module.exports = checkJwt;
