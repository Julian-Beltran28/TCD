// Configuración centralizada de la API
const API_CONFIG = {
  // Cambiar esta URL según el entorno
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  
  // Endpoints principales
  ENDPOINTS: {
    LOGIN: '/api/login',
    USUARIOS: '/api/usuarios',
    PRODUCTOS: '/api/productos', 
    CATEGORIAS: '/api/categorias',
    SUBCATEGORIAS: '/api/subcategorias',
    PROVEEDORES: '/api/proveedores',
    VENTAS: '/api/ventas',
    PERFIL: '/api/perfil',
    UPLOADS: '/uploads'
  },
  
  // Función helper para construir URLs completas
  getFullUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
  
  // URLs completas más utilizadas
  get LOGIN_URL() { return this.getFullUrl(this.ENDPOINTS.LOGIN); },
  get USUARIOS_URL() { return this.getFullUrl(this.ENDPOINTS.USUARIOS); },
  get PRODUCTOS_URL() { return this.getFullUrl(this.ENDPOINTS.PRODUCTOS); },
  get CATEGORIAS_URL() { return this.getFullUrl(this.ENDPOINTS.CATEGORIAS); },
  get SUBCATEGORIAS_URL() { return this.getFullUrl(this.ENDPOINTS.SUBCATEGORIAS); },
  get PROVEEDORES_URL() { return this.getFullUrl(this.ENDPOINTS.PROVEEDORES); },
  get VENTAS_URL() { return this.getFullUrl(this.ENDPOINTS.VENTAS); },
  get PERFIL_URL() { return this.getFullUrl(this.ENDPOINTS.PERFIL); },
  get UPLOADS_URL() { return this.getFullUrl(this.ENDPOINTS.UPLOADS); }
};

export default API_CONFIG;