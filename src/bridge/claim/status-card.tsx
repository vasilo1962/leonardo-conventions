import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
  LIGHT_POPUP_FRAME_BORDER_COLOR,
  LIGHT_POPUP_LAPTOP_MAX_WIDTH_RATIO,
  LIGHT_POPUP_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_MOBILE_MAX_WIDTH_RATIO,
  LIGHT_POPUP_TITLE_COLOR,
  LIGHT_POPUP_TITLE_FONT_RATIO,
  getLightPopupFrameRadius,
} from '@/lib/light-popup-style';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import type { InfoLanguage } from '@/lib/info-popup-translations';

const frameStyle = {
  alignSelf: 'center' as const,
  backgroundColor: LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
  alignItems: 'center' as const,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
};
const titleStyle = { color: LIGHT_POPUP_TITLE_COLOR, textAlign: 'center' as const };
const STATUS_HORIZONTAL_PADDING_TO_MESSAGE_FONT_RATIO = 1.00;

// Claim's selection form and technical failure keep their existing appearance.
export const claimStatusStyles = StyleSheet.create({
  dialog: {
    ...frameStyle,
    borderColor: LIGHT_POPUP_FRAME_BORDER_COLOR,
  },
  title: { ...titleStyle, fontWeight: '800' },
});

const statusCardStyles = StyleSheet.create({
  dialog: frameStyle,
  title: { ...titleStyle, fontWeight: '600' },
});

// One visual source for Claim decisions and passive Challenge acceptances.
// Their overlays, input behavior, announcements and lifetimes remain separate.
export function getClaimStatusCardAppearance(width: number, height: number, frameHeight: number) {
  const mobile = width < 768;
  const titleFontSize = responsiveHeightFontSize(height * LIGHT_POPUP_TITLE_FONT_RATIO, width, height, mobile);
  const messageFontSize = responsiveHeightFontSize(height * LIGHT_POPUP_MESSAGE_FONT_RATIO, width, height, mobile);
  return {
    dialog: [statusCardStyles.dialog, {
      maxWidth: width * (mobile ? LIGHT_POPUP_MOBILE_MAX_WIDTH_RATIO : LIGHT_POPUP_LAPTOP_MAX_WIDTH_RATIO),
      paddingHorizontal: messageFontSize * STATUS_HORIZONTAL_PADDING_TO_MESSAGE_FONT_RATIO,
      paddingVertical: messageFontSize * LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
      borderRadius: getLightPopupFrameRadius(frameHeight, height),
    }],
    title: [statusCardStyles.title, { fontSize: titleFontSize }],
  };
}

export default function ClaimStatusCard({ message, language, onShown }: {
  message: string;
  language: InfoLanguage;
  onShown: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [frameHeight, setFrameHeight] = useState(0);
  const appearance = getClaimStatusCardAppearance(width, height, frameHeight);

  return <View testID="challenge-activity-notice" pointerEvents="none"
    onLayout={event => {
      const size = event.nativeEvent.layout;
      setFrameHeight(size.height);
      if (size.width > 0 && size.height > 0) onShown();
    }}
    style={appearance.dialog}>
    <Text accessibilityLanguage={language} {...{ lang: language }}
      style={[appearance.title, { alignSelf: 'stretch', writingDirection: language === 'ar' || language === 'he' ? 'rtl' : 'ltr' }]}>{message}</Text>
  </View>;
}

