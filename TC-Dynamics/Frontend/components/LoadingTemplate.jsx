// Plantilla para actualizar archivos con sistema de loading
// Este es un template que puedes copiar y pegar en cualquier componente

import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

// 1. Reemplaza la importación de useRouter:
// ANTES: import { useRouter } from 'expo-router';
// DESPUÉS: import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

// 2. Reemplaza la inicialización del router:
// ANTES: const router = useRouter();
// DESPUÉS: const { navigateWithLoading, replaceWithLoading, goBackWithLoading, showLoading, hideLoading } = useNavigationWithLoading();

// 3. Para navegación simple, reemplaza:
// ANTES: router.push('/ruta')
// DESPUÉS: navigateWithLoading('/ruta', 'Cargando...')

// 4. Para reemplazar ruta, reemplaza:
// ANTES: router.replace('/ruta')
// DESPUÉS: replaceWithLoading('/ruta', 'Cargando...', 500)

// 5. Para regresar:
// ANTES: router.back()
// DESPUÉS: goBackWithLoading('Regresando...')

// 6. Para operaciones que requieren loading manual:
// ANTES: 
// setLoading(true);
// try { /* operación */ } finally { setLoading(false); }
//
// DESPUÉS:
// showLoading('Mensaje...');
// try { /* operación */ } finally { hideLoading(); }

// 7. Elimina estados de loading locales:
// ELIMINAR: const [loading, setLoading] = useState(false);

const ComponentTemplate = () => {
  const { navigateWithLoading, showLoading, hideLoading } = useNavigationWithLoading();
  
  const handleNavigation = () => {
    navigateWithLoading('/destino', 'Navegando...');
  };
  
  const handleAsyncOperation = async () => {
    showLoading('Procesando...');
    try {
      // Tu operación aquí
      await fetch('/api/endpoint');
    } finally {
      hideLoading();
    }
  };
  
  return {
    handleNavigation,
    handleAsyncOperation
  };
};

export default ComponentTemplate;