// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'person.fill': 'person',
  'building.2.fill': 'business',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'power': 'power-settings-new',
  'list': 'list',

  'card.fill': 'credit-card',         // Tarjeta / métodos de pago
  'bell.fill': 'notifications',       // Notificaciones
  'gearshape.fill': 'settings',       // Configuración
  'lock.fill': 'lock',                // Seguridad
  'star.fill': 'star',                // Favoritos
  'heart.fill': 'favorite',           // Me gusta
  'map.fill': 'map',                  // Mapa
  'phone.fill': 'call',               // Teléfono
  'envelope.fill': 'email',           // Correo
  'person.crop.circle': 'account-circle', // Perfil redondo
  'shield.fill': 'security',          // Seguridad extra
  'calendar': 'calendar-today',       // Calendario
  'camera.fill': 'photo-camera',      // Cámara
  'doc.text.fill': 'description',     // Documentos
  'chart.bar.fill': 'bar-chart',      // Gráficos
  'cart.fill': 'shopping-cart',       // Compras
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
