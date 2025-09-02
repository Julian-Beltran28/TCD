import AsyncStorage from '@react-native-async-storage/async-storage';

// Guarda el token de usuario
export const setToken = async (token) => {
	try {
		await AsyncStorage.setItem('userToken', token);
	} catch (_e) {
		// Error al guardar
	}
};

// Obtiene el token de usuario
export const getToken = async () => {
	try {
		return await AsyncStorage.getItem('userToken');
	} catch (_e) {
		return null;
	}
};

// Elimina el token de usuario
export const removeToken = async () => {
	try {
		await AsyncStorage.removeItem('userToken');
	} catch (_e) {
		// Error al eliminar
	}
};

// Default export vacío para cumplir con Expo Router
export default {};
