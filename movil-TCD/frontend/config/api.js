// frontend/config/api.js
import axios from "axios";

// 👇 Cambia esta IP por la de tu PC en la red WiFi
const LOCAL_IP = "192.168.80.19"; 
const PORT = 3000;

// ⚠️ Si usas Expo Go en un CELULAR REAL → SIEMPRE tu IP local
// ⚠️ Si usas emulador Android → 10.0.2.2
// ⚠️ Si usas emulador iOS → localhost
const API_URL = `http://${LOCAL_IP}:${PORT}/api`;

// 📌 Instancia de Axios lista para usar
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export default api;
