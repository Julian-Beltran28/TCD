import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

export const getVentas = () => axios.get(`${API_URL}/ventas`);
export const crearVenta = (data) => axios.post(`${API_URL}/ventas`, data);