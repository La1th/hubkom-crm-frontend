// Auth0 configuration settings
export const auth0Config = {
  domain: "dev-w7fn8kkc2paqxg78.us.auth0.com", // Replace with your actual Auth0 domain e.g., dev-xyz123.us.auth0.com
  clientId: "RLZx3g03XDgKxApcwTx0t9MoGJcP65Si", // Replace with your actual Auth0 client ID
  audience: "https://dev-w7fn8kkc2paqxg78.us.auth0.com/api/v2/", // Default Auth0 Management API audience
  redirectUri: "https://hubkom-crm-frontend.vercel.app", // Explicitly set the redirect URI
  scope: "openid profile email"
}; 