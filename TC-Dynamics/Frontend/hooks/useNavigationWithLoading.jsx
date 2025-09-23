import { useRouter } from 'expo-router';
import { useLoading } from '../context/LoadingContext';

export const useNavigationWithLoading = () => {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const navigateWithLoading = async (route, loadingText = 'Navegando...', delay = 800) => {
    try {
      showLoading(loadingText);
      
      // Simular un pequeño delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Navegar
      router.push(route);
      
      // Ocultar loading después de un pequeño delay
      setTimeout(() => {
        hideLoading();
      }, 400);
    } catch (error) {
      hideLoading();
      console.error('Error en navegación:', error);
    }
  };

  const replaceWithLoading = async (route, loadingText = 'Cargando...', delay = 800) => {
    try {
      showLoading(loadingText);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      router.replace(route);
      
      setTimeout(() => {
        hideLoading();
      }, 400);
    } catch (error) {
      hideLoading();
      console.error('Error en navegación:', error);
    }
  };

  const goBackWithLoading = async (loadingText = 'Regresando...', delay = 600) => {
    try {
      showLoading(loadingText);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      router.back();
      
      setTimeout(() => {
        hideLoading();
      }, 300);
    } catch (error) {
      hideLoading();
      console.error('Error en navegación:', error);
    }
  };

  return {
    navigateWithLoading,
    replaceWithLoading,
    goBackWithLoading,
    showLoading,
    hideLoading,
  };
};