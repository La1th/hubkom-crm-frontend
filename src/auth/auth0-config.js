// Auth0 configuration settings
export const auth0Config = {
  domain: "YOUR_AUTH0_DOMAIN", // Replace with your actual Auth0 domain e.g., dev-xyz123.us.auth0.com
  clientId: "YOUR_AUTH0_CLIENT_ID", // Replace with your actual Auth0 client ID
  audience: "YOUR_API_IDENTIFIER", // Replace with your API identifier if you set one up
  redirectUri: window.location.origin,
  scope: "openid profile email"
}; 