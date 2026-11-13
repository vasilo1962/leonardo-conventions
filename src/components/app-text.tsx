import {
  StyleSheet,
  type TextProps,
  type TextStyle,
  Text as NativeText,
} from 'react-native';

import { getDeviceFontRatio } from '@/lib/interface-scale';

type AppTextProps = TextProps & {
  scaleByDevice?: boolean;
};

export default function AppText({
  style,
  scaleByDevice = true,
  ...props
}: AppTextProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const deviceRatio = scaleByDevice
    ? getDeviceFontRatio()
    : 1;
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
    <NativeText
      {...props}
      style={[style, deviceTextStyle]}
    />
  );
}
