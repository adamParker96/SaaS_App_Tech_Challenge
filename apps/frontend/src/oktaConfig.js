const oktaConfig = {
  issuer: "https://your-okta-domain.okta.com/oauth2/default",
  clientId: "your-client-id",
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email"],
};

export default oktaConfig;
