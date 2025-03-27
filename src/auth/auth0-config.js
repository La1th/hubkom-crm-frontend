// Auth0 configuration settings
export const auth0Config = {
  domain: "dev-w7fn8kkc2paqxg78.us.auth0.com", // Replace with your actual Auth0 domain e.g., dev-xyz123.us.auth0.com
  clientId: "RLZx3g03XDgKxApcwTx0t9MoGJcP65Si", // Replace with your actual Auth0 client ID
  audience: "https://hubkom-crm-backend.onrender.com/api", // Replace with your API identifier if you set one up
  redirectUri: window.location.origin,
  scope: "openid profile email"
}; 