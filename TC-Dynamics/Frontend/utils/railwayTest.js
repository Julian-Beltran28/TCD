/**
 * Utilidades para probar la conexión con Railway
 */

// Configuración de la API
const API_BASE = __DEV__ 
  ? "http://192.168.20.31:8084" 
  : "https://tcd-production.up.railway.app";

/**
 * Probar la conexión con el servidor de Railway
 */
export const testRailwayConnection = async () => {
  try {
    console.log("🧪 Probando conexión con Railway...");
    console.log("🔗 URL:", API_BASE);
    
    // Probar endpoint básico
    const response = await fetch(`${API_BASE}/api-docs`, {
      method: "HEAD",
      timeout: 10000
    });
    
    if (response.ok) {
      console.log("✅ Conexión exitosa con Railway");
      return { success: true, status: response.status };
    } else {
      console.log("⚠️ Servidor responde pero con error:", response.status);
      return { success: false, status: response.status, error: "Servidor no disponible" };
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Probar el endpoint de login específicamente
 */
export const testLoginEndpoint = async () => {
  try {
    console.log("🧪 Probando endpoint de login...");
    
    // Hacer una petición sin credenciales para ver si el endpoint responde
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Sin credenciales para probar solo conectividad
    });
    
    const data = await response.json();
    console.log("📡 Respuesta del endpoint login:", response.status, data);
    
    return { 
      success: true, 
      status: response.status, 
      message: data.mensaje || "Endpoint responde correctamente" 
    };
  } catch (error) {
    console.error("❌ Error en endpoint login:", error.message);
    return { success: false, error: error.message };
  }
};

export default {
  testRailwayConnection,
  testLoginEndpoint,
  API_BASE
};