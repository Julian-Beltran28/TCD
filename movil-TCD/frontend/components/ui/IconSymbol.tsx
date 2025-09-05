// Fallback for using MaterialIcons on Android and web.
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// 👇 Agregamos extensiones manuales para íconos que no existen en SymbolViewProps
type ExtraIcons = 'card.fill' | 'cart.fill';

// 👇 Unimos los símbolos nativos + los extra que queremos
type IconMapping = Record<
  SymbolViewProps['name'] | ExtraIcons,
  ComponentProps<typeof MaterialIcons>['name']
>;

// Mapping completo
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'cart.fill': 'shopping-cart',   // Carrito
  'card.fill': 'credit-card',     // Perfil
  'person.fill': 'person',        // Usuarios
  'building.2.fill': 'business',  // Proveedores
  'list': 'list',                 // Categorías
  'power': 'power-settings-new'   // Cerrar Sesión
};

type IconSymbolName = keyof typeof MAPPING;

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
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
