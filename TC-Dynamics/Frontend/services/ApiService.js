import Config from "@/constants/config";

class ApiService {
  constructor() {
    this.baseURL = Config.API_BASE;
    this.timeout = Config.TIMEOUT;
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: Config.DEFAULT_HEADERS,
      timeout: this.timeout,
      ...options
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Response: ${response.status}`, data);
      return { success: true, data, status: response.status };
      
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);
      return { 
        success: false, 
        error: error.message, 
        status: error.status || 500 
      };
    }
  }

  // Métodos específicos para cada endpoint
  async login(correo, contrasena) {
    return this.request(Config.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ correo, contrasena })
    });
  }

  async getProfile(token) {
    return this.request(Config.ENDPOINTS.PERFIL, {
      method: "GET",
      headers: {
        ...Config.DEFAULT_HEADERS,
        "Authorization": `Bearer ${token}`
      }
    });
  }

  async getVentas(token) {
    return this.request(Config.ENDPOINTS.VENTAS, {
      method: "GET",
      headers: {
        ...Config.DEFAULT_HEADERS,
        "Authorization": `Bearer ${token}`
      }
    });
  }

  async getProductos(token) {
    return this.request(Config.ENDPOINTS.PRODUCTOS, {
      method: "GET",
      headers: {
        ...Config.DEFAULT_HEADERS,
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Método para verificar la conectividad con el servidor
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/api-docs`, {
        method: "HEAD",
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error("❌ Error de conectividad:", error);
      return false;
    }
  }
}

// Exportar una instancia singleton
const apiService = new ApiService();
export default apiService;