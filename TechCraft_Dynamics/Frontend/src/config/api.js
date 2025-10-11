// src/config/api.js
const API_CONFIG = {                           // ← Inicio del objeto
  baseURL: 'http://localhost:4000',            // ← Cambiado a servidor local
    
  endpoints: {                                 // ← Otro objeto dentro
    login: '/api/login',
    users: '/api/users',
    products: '/api/products',
  }                                           // ← Fin del objeto endpoints
};                                            // ← Fin del objeto API_CONFIG

export default API_CONFIG;