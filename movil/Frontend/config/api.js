import axios from "axios";

// 👇 Cambia esta IP por la de tu PC en la red WiFi
const LOCAL_IP = "192.168.20.31"; 
const PORT = 3000;


const API_URL = `http://${LOCAL_IP}:${PORT}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 7000,
});

export default api;
