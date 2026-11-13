import {
  StyleSheet,
  type TextInputProps,
  type TextStyle,
  TextInput as NativeTextInput,
} from 'react-native';

import { getDeviceFontRatio } from '@/lib/interface-scale';

export default function AppTextInput({
  style,
  ...props
}: TextInputProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const deviceRatio = getDeviceFontRatio();
  const deviceTextStyle: TextStyle | undefined =
    deviceRatio === 1
      ? undefined
      : {
          ...(typeof flattenedStyle?.fontSize === 'number'
            ? { fontSize: flattenedStyle.fontSize * deviceRatio }
            : {}),
          ...(typeof flattenedStyle?.lineHeight === 'number'
            ? { lineHeight: flattenedStyle.lineHeight * deviceRatio }
            : {}),
        };

  return (
    <NativeTextInput
      {...props}
      style={[style, deviceTextStyle]}
    />
  );
}
