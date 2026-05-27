/**
 * @fileoverview Global type declarations for non-TypeScript assets and modules.
 * Ensures the TypeScript compiler understands imports of images and icons.
 */
declare module 'react-native-vector-icons/Feather' {
  import { Icon } from 'react-native-vector-icons/Icon';
  const Feather: typeof Icon;
  export default Feather;
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  const MaterialIcons: typeof Icon;
  export default MaterialIcons;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
