// src/config/api.js
const API_CONFIG = {                           // ← Inicio del objeto
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://tcd-production.up.railway.app',
    
  endpoints: {                                 // ← Otro objeto dentro
    login: '/api/login',
    users: '/api/users',
    products: '/api/products',
  }                                           // ← Fin del objeto endpoints
};                                            // ← Fin del objeto API_CONFIG

export default API_CONFIG;