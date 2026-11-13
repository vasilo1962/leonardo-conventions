import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import Text from '@/components/app-text';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import {
  BLUE_POPUP_CLOSE_FONT_RATIO,
  BLUE_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_LETTER_SPACING,
  BLUE_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO,
  BLUE_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO,
  BLUE_POPUP_MESSAGE_FONT_RATIO,
  BLUE_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
  BLUE_POPUP_TITLE_COLOR,
  BLUE_POPUP_TITLE_FONT_RATIO,
} from '@/lib/blue-popup-style';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import {
  LIGHT_POPUP_CLOSE_FONT_RATIO,
  LIGHT_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_LETTER_SPACING,
  LIGHT_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO,
  LIGHT_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO,
  LIGHT_POPUP_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_TITLE_COLOR,
  LIGHT_POPUP_TITLE_FONT_RATIO,
} from '@/lib/light-popup-style';

const LANGUAGE_NAMES: Record<InfoLanguage, string> = {
  en: 'ENGLISH', fr: 'FRANÇAIS', nl: 'NEDERLANDS', zh: '中文',
  it: 'ITALIANO', de: 'DEUTSCH', sv: 'SVENSKA', da: 'DANSK',
  no: 'NORSK', pl: 'POLSKI', ja: '日本語', he: 'עברית',
  es: 'ESPAÑOL', pt: 'PORTUGUÊS', hi: 'हिन्दी', tr: 'TÜRKÇE',
  ru: 'РУССКИЙ', el: 'ΕΛΛΗΝΙΚΑ', fi: 'SUOMI', cs: 'ČEŠTINA',
  is: 'ÍSLENSKA', hu: 'MAGYAR', id: 'BAHASA INDONESIA', ar: 'العربية',
  th: 'ไทย', ko: '한국어',
};

type PopupLanguageControlProps = {
  accessibilityLanguage?: InfoLanguage;
  showEnglish: boolean;
  playerLanguage: InfoLanguage;
  variant?: 'light' | 'blue';
  rightAccessoryWidth?: number;
  inlineCentered?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  onPress: () => void;
};

export default function PopupLanguageControl({
  showEnglish,
  playerLanguage,
  accessibilityLanguage,
  variant = 'light',
  rightAccessoryWidth = 0,
  inlineCentered = false,
  onClose,
  closeLabel = 'Close',
  onPress,
}: PopupLanguageControlProps) {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const proportionalFont = (ratio: number) => responsiveHeightFontSize(
    height * ratio,
    width,
    height,
    isMobile
  );
  const blue = variant === 'blue';
  const fontSize = proportionalFont(
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_FONT_RATIO
  );
  const closeFontSize = proportionalFont(
    blue ? BLUE_POPUP_CLOSE_FONT_RATIO : LIGHT_POPUP_CLOSE_FONT_RATIO
  );
  const messageFontSize = proportionalFont(
    blue ? BLUE_POPUP_MESSAGE_FONT_RATIO : LIGHT_POPUP_MESSAGE_FONT_RATIO
  );
  const titleFontSize = proportionalFont(
    blue ? BLUE_POPUP_TITLE_FONT_RATIO : LIGHT_POPUP_TITLE_FONT_RATIO
  );
  const contentPadding = messageFontSize * (
    blue
      ? BLUE_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO
      : LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO
  );
  const controlHeight = fontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO
  );
  const horizontalPadding = fontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO
  );
  const lineHeight = fontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO
  );
  const topOffset = fontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO
  );
  const rightOffset = fontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO
  );
  const closeTopOffset = fontSize * (
    blue
      ? BLUE_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO
      : LIGHT_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO
  );
  const titleGap = titleFontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO
  );
  const letterSpacing = blue
    ? BLUE_POPUP_LANGUAGE_CONTROL_LETTER_SPACING
    : LIGHT_POPUP_LANGUAGE_CONTROL_LETTER_SPACING;
  const color = blue ? BLUE_POPUP_TITLE_COLOR : LIGHT_POPUP_TITLE_COLOR;
  const targetLabel = showEnglish ? LANGUAGE_NAMES[playerLanguage] : 'ENGLISH';
  const cornerRowHeight = Math.max(controlHeight, closeFontSize * 1.25);

  return (
    <View
      style={[
        styles.row,
        inlineCentered
          ? {
              height: controlHeight,
              alignItems: 'center',
            }
          : onClose
            ? {
                height: cornerRowHeight,
                marginTop: -contentPadding + topOffset,
                marginHorizontal: -contentPadding,
                marginBottom: titleGap,
                paddingHorizontal: rightOffset,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }
            : {
                height: controlHeight,
                marginTop: -contentPadding + topOffset,
                marginHorizontal: -contentPadding,
                marginBottom: titleGap,
                paddingRight: rightOffset + rightAccessoryWidth,
              },
      ]}
    >
      <Pressable
        testID="popup-auxiliary-control"
        accessibilityRole="button"
        accessibilityLabel={targetLabel}
        {...(accessibilityLanguage ? {
          accessibilityLanguage: showEnglish ? playerLanguage : 'en',
          lang: showEnglish ? playerLanguage : 'en',
          onPointerEnter: (event: { currentTarget: unknown }) =>
            focusHoveredMenuControl(event, showEnglish ? playerLanguage : 'en'),
        } : {})}
        onPress={event => {
          event.stopPropagation();
          onPress();
        }}
        style={({ pressed }) => [
          styles.control,
          {
            height: controlHeight,
            paddingHorizontal: horizontalPadding,
          },
          pressed && styles.pressed,
        ]}
      >
        <Text
          {...(accessibilityLanguage ? {
            accessible: false, importantForAccessibility: 'no-hide-descendants' as const,
            'aria-hidden': true,
          } : {})}
          scaleByDevice={false}
          style={[
            styles.text,
            {
              color,
              fontSize,
              lineHeight,
              letterSpacing,
            },
          ]}
        >
          {`🌐 ${targetLabel}`}
        </Text>
      </Pressable>
      {onClose ? (
        <Pressable
          testID="popup-auxiliary-control"
        accessibilityRole="button"
          accessibilityLabel={closeLabel}
          {...(accessibilityLanguage ? {
            accessibilityLanguage, lang: accessibilityLanguage,
            onPointerEnter: (event: { currentTarget: unknown }) =>
              focusHoveredMenuControl(event, accessibilityLanguage),
          } : {})}
          onPress={event => {
            event.stopPropagation();
            onClose();
          }}
          style={({ pressed }) => [
            styles.closeControl,
            {
              height: cornerRowHeight,
              transform: [{ translateY: closeTopOffset - topOffset }],
            },
            pressed && styles.pressed,
          ]}
        >
          <Text
          {...(accessibilityLanguage ? {
            accessible: false, importantForAccessibility: 'no-hide-descendants' as const,
            'aria-hidden': true,
          } : {})}
            scaleByDevice={false}
            style={[
              styles.closeText,
              {
                color,
                fontSize: closeFontSize,
                lineHeight: closeFontSize * 1.25,
              },
            ]}
          >
            ×
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}


export function PopupCloseControl({
  variant = 'light',
  onClose,
  closeLabel = 'Close',
}: {
  variant?: 'light' | 'blue';
  onClose?: () => void;
  closeLabel?: string;
}) {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const blue = variant === 'blue';
  const fontSize = responsiveHeightFontSize(
    height * (blue ? BLUE_POPUP_CLOSE_FONT_RATIO : LIGHT_POPUP_CLOSE_FONT_RATIO),
    width,
    height,
    isMobile
  );
  const languageFontSize = responsiveHeightFontSize(
    height * (
      blue
        ? BLUE_POPUP_LANGUAGE_CONTROL_FONT_RATIO
        : LIGHT_POPUP_LANGUAGE_CONTROL_FONT_RATIO
    ),
    width,
    height,
    isMobile
  );
  const messageFontSize = responsiveHeightFontSize(
    height * (blue ? BLUE_POPUP_MESSAGE_FONT_RATIO : LIGHT_POPUP_MESSAGE_FONT_RATIO),
    width,
    height,
    isMobile
  );
  const contentPadding = messageFontSize * (
    blue
      ? BLUE_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO
      : LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO
  );
  const offset = languageFontSize * (
    blue
      ? BLUE_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO
      : LIGHT_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO
  );
  const topOffset = languageFontSize * (
    blue
      ? BLUE_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO
      : LIGHT_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO
  );
  const color = blue ? BLUE_POPUP_TITLE_COLOR : LIGHT_POPUP_TITLE_COLOR;

  if (!onClose) {
    return null;
  }

  return (
    <Pressable
      testID="popup-auxiliary-control"
        accessibilityRole="button"
      accessibilityLabel={closeLabel}
      onPress={event => {
        event.stopPropagation();
        onClose();
      }}
      style={({ pressed }) => [
        styles.standaloneClose,
        {
          right: -contentPadding + offset,
          top: -contentPadding + topOffset,
          height: fontSize * 1.25,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        scaleByDevice={false}
        style={[
          styles.closeText,
          {
            color,
            fontSize,
            lineHeight: fontSize * 1.25,
          },
        ]}
      >
        ×
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '900',
    textAlign: 'center',
  },
  closeControl: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standaloneClose: {
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.80,
  },
});

