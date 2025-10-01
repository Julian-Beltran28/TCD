// Utilidad para verificar y limpiar URLs de imágenes
export const IMAGE_CONFIG = {
  // Dominios válidos para imágenes
  VALID_DOMAINS: [
    'tcd-production.up.railway.app',
    'railway.app'
  ],
  
  // URLs que deben ser filtradas
  INVALID_PATTERNS: [
    'example.com',
    'localhost',
    '127.0.0.1',
    'test.com',
    'demo.com',
    'placeholder',
    'sample.com',
    'dummy.com',
    'fake.com'
  ],
  
  // Extensiones de imagen válidas
  VALID_EXTENSIONS: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'
  ]
};

/**
 * Valida si una URL de imagen es válida
 * @param {string} imageUrl - URL de la imagen a validar
 * @returns {boolean} - true si es válida, false si no
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }

  const urlLower = imageUrl.toLowerCase();
  
  // Verificar patrones inválidos
  const hasInvalidPattern = IMAGE_CONFIG.INVALID_PATTERNS.some(pattern => 
    urlLower.includes(pattern.toLowerCase())
  );
  
  if (hasInvalidPattern) {
    console.log('🚫 URL de imagen contiene patrón inválido:', imageUrl);
    return false;
  }

  // Si es una URL completa, verificar el dominio
  if (imageUrl.startsWith('http')) {
    const isValidDomain = IMAGE_CONFIG.VALID_DOMAINS.some(domain => 
      urlLower.includes(domain.toLowerCase())
    );
    
    if (!isValidDomain) {
      console.log('🚫 Dominio de imagen no permitido:', imageUrl);
      return false;
    }
  }

  return true;
};

/**
 * Construye una URL de imagen válida desde Railway
 * @param {string} baseUrl - URL base del servidor
 * @param {string} imagePath - Ruta de la imagen
 * @returns {string|null} - URL construida o null si es inválida
 */
export const buildImageUrl = (baseUrl, imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa válida
  if (imagePath.startsWith('http')) {
    return isValidImageUrl(imagePath) ? imagePath : null;
  }
  
  // Construir URL desde el servidor Railway
  let finalUrl;
  
  if (imagePath.startsWith('/uploads/')) {
    finalUrl = `${baseUrl}${imagePath}`;
  } else if (imagePath.includes('/uploads/')) {
    finalUrl = `${baseUrl}${imagePath}`;
  } else {
    finalUrl = `${baseUrl}/uploads/${imagePath}`;
  }
  
  return isValidImageUrl(finalUrl) ? finalUrl : null;
};

/**
 * Verifica si una imagen existe en el servidor
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<boolean>} - Promise que resuelve true si existe
 */
export const checkImageExists = async (imageUrl) => {
  if (!isValidImageUrl(imageUrl)) {
    return false;
  }
  
  try {
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      timeout: 5000 // 5 segundos de timeout
    });
    
    if (response.ok) {
      console.log('✅ Imagen verificada:', imageUrl);
      return true;
    } else {
      console.log('❌ Imagen no encontrada (HTTP ' + response.status + '):', imageUrl);
      return false;
    }
  } catch (error) {
    console.log('❌ Error verificando imagen:', imageUrl, error.message);
    return false;
  }
};

/**
 * Obtiene estadísticas de las imágenes de los productos
 * @param {Array} productos - Array de productos
 * @returns {Object} - Estadísticas de imágenes
 */
export const getImageStats = (productos) => {
  let total = 0;
  let withImages = 0;
  let validUrls = 0;
  let invalidUrls = 0;
  let missingImages = 0;

  productos.forEach(producto => {
    total++;
    const imagePath = producto.Imagen_producto || producto.imagen || producto.Imagen || producto.image;
    
    if (imagePath) {
      withImages++;
      if (isValidImageUrl(imagePath)) {
        validUrls++;
      } else {
        invalidUrls++;
      }
    } else {
      missingImages++;
    }
  });

  const stats = {
    total,
    withImages,
    validUrls,
    invalidUrls,
    missingImages,
    percentageWithImages: total > 0 ? Math.round((withImages / total) * 100) : 0,
    percentageValid: withImages > 0 ? Math.round((validUrls / withImages) * 100) : 0
  };

  console.log('📊 Estadísticas de imágenes:', stats);
  return stats;
};

export default {
  IMAGE_CONFIG,
  isValidImageUrl,
  buildImageUrl,
  checkImageExists,
  getImageStats
};