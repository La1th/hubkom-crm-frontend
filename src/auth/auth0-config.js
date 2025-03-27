// Auth0 configuration settings
export const auth0Config = {
  domain: "dev-w7fn8kkc2paqxg78.us.auth0.com", // Replace with your actual Auth0 domain e.g., dev-xyz123.us.auth0.com
  clientId: "RLZx3g03XDgKxApcwTx0t9MoGJcP65Si", // Replace with your actual Auth0 client ID
  audience: "https://hubkom-crm-backend.onrender.com/api", // This must match the AUTH0_AUDIENCE in backend
  redirectUri: "https://hubkom-crm-frontend.vercel.app", // Explicitly set the redirect URI
  scope: "openid profile email"
}; 