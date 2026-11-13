import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import AppOverlay from '@/components/app-overlay';
import PopupLanguageControl from '@/components/popup-language-control';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import useInfoMessageReading from '@/shared/accessibility/use-info-message-reading';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { getSystemPopupCopy } from '@/lib/system-popup-translations';
import * as light from '@/lib/light-popup-style';
import { getFriendCopy, getFriendRequestMessage, getFriendAcceptanceMessage } from './copy';

// A decorative pair of people, drawn with native views so no icon font is required.
function FriendshipMark({ font }: { font: number }) {
  const size = font * 2.6;
  const stroke = font * 0.08;
  const gold = '#b08a45';
  return <View pointerEvents="none" aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={{ width: size, height: size * 0.72, alignSelf: 'center' }}>
    {[0, 0.46].map(left => <View key={left} style={{ position: 'absolute', left: size * left, top: 0, width: size * 0.54, height: size * 0.72 }}>
      <View style={{ alignSelf: 'center', width: size * 0.24, height: size * 0.24,
        borderRadius: size * 0.12, borderWidth: stroke, borderColor: gold }} />
      <View style={{ position: 'absolute', top: size * 0.32, width: size * 0.54, height: size * 0.37,
        borderTopLeftRadius: size * 0.27, borderTopRightRadius: size * 0.27,
        borderWidth: stroke, borderBottomWidth: 0, borderColor: gold }} />
    </View>)}
  </View>;
}

type Props = {
  username: string; busy: boolean; failed: boolean; accepted?: boolean;
  language: InfoLanguage; playerLanguage: InfoLanguage; showEnglish: boolean;
  toggleLanguage: () => void; onClose: () => void; onAccept?: () => void; onReject?: () => void;
};

export default function FriendRequestPopup({ username, busy, failed, language, playerLanguage,
  showEnglish, toggleLanguage, onClose, onAccept, onReject, accepted = false }: Props) {
  const { width, height } = useWindowDimensions();
  const mobile = width < 768;
  const font = (ratio: number) => responsiveHeightFontSize(height * ratio, width, height, mobile);
  const messageFont = font(light.LIGHT_POPUP_MESSAGE_FONT_RATIO);
  const buttonFont = font(light.LIGHT_POPUP_BUTTON_FONT_RATIO);
  const secondaryFont = font(light.LIGHT_POPUP_SECONDARY_ACTION_FONT_RATIO);
  const buttonHeight = light.getTranslatedLightPopupButtonHeight(buttonFont, mobile, true);
  const secondaryHeight = light.getTranslatedLightPopupButtonHeight(secondaryFont, mobile, true);
  const [frameHeight, setFrameHeight] = useState(0);
  const messageRef = useRef<Text>(null);
  const voice = useVoiceMode();
  const copy = getFriendCopy(language);
  const message = accepted ? getFriendAcceptanceMessage(language, username) : getFriendRequestMessage(language, username);
  const closeLabel = getSystemPopupCopy(language).close;
  const primaryLabel = accepted ? closeLabel : copy.accept;
  useInfoMessageReading(messageRef, true, voice.enabled, message, language);
  return <AppOverlay visible transparent animationType="fade" announceContent={false} readPrimaryAction={false} onRequestClose={onClose}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.60)' }}>
      <View testID={accepted ? "friend-accepted-card" : "friend-request-card"} accessibilityViewIsModal accessibilityLanguage={language} {...{ lang: language }}
        onLayout={event => setFrameHeight(event.nativeEvent.layout.height)}
        style={{ maxWidth: width * (mobile ? light.LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO : light.LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO),
          maxHeight: '90%', padding: messageFont * light.LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
          backgroundColor: light.LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
          borderWidth: height * light.LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO,
          borderColor: light.LIGHT_POPUP_FRAME_BORDER_COLOR, borderRadius: light.getLightPopupFrameRadius(frameHeight, height),
          shadowColor: '#0a3c6a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 8 }}>
        <View style={{ flexShrink: 1 }}>
        <PopupLanguageControl variant="light" {...{ playerLanguage, showEnglish }} onPress={toggleLanguage} onClose={onClose} closeLabel={closeLabel} />
        <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
          <FriendshipMark font={messageFont} />
          <Text ref={messageRef} testID={accepted ? "friend-accepted-message" : "friend-request-message"} accessibilityLanguage={language} {...{ lang: language, tabIndex: -1 as const }}
            style={{ marginTop: messageFont * light.LIGHT_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO,
              color: light.LIGHT_POPUP_MESSAGE_COLOR, fontSize: messageFont,
              lineHeight: messageFont * light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO, textAlign: 'center' }}>
            {accepted ? message : <>{copy.requestNotice}{'\n'}<Text style={{ color: light.LIGHT_POPUP_TITLE_COLOR, fontWeight: '700' }}>{username}</Text></>}
          </Text>
          {failed ? <Text accessibilityRole="alert" accessibilityLanguage={language}
            style={{ marginTop: messageFont, color: light.LIGHT_POPUP_MESSAGE_COLOR, fontSize: messageFont,
              lineHeight: messageFont * light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO, textAlign: 'center' }}>{copy.failed}</Text> : null}
        </ScrollView>
        <View style={{ alignItems: 'center', marginTop: messageFont * light.LIGHT_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO }}>
          <Pressable accessibilityRole="button" accessibilityLabel={primaryLabel} accessibilityLanguage={language} {...{ lang: language }}
            accessibilityState={{ disabled: busy }} disabled={busy} onPress={accepted ? onClose : onAccept} onHoverIn={event => focusHoveredMenuControl(event, language)}
            style={({ pressed }) => ({ height: buttonHeight, justifyContent: 'center', alignItems: 'center',
              paddingHorizontal: buttonFont * light.LIGHT_POPUP_BUTTON_HORIZONTAL_PADDING_TO_FONT_RATIO / 2,
              backgroundColor: light.LIGHT_POPUP_PRIMARY_BUTTON_BACKGROUND_COLOR,
              borderWidth: height * light.LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
              borderColor: light.LIGHT_POPUP_PRIMARY_BUTTON_BORDER_COLOR, borderRadius: light.getLightPopupButtonRadius(buttonHeight),
              opacity: busy ? 0.55 : pressed ? 0.80 : 1 })}>
            <Text aria-hidden numberOfLines={1} style={{ color: light.LIGHT_POPUP_BUTTON_COLOR, fontSize: buttonFont, fontWeight: '900',
              letterSpacing: buttonFont * light.LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO }}>{primaryLabel}</Text>
          </Pressable>
          {!accepted ? <Pressable accessibilityRole="button" accessibilityLabel={copy.reject} accessibilityLanguage={language} {...{ lang: language }}
            accessibilityState={{ disabled: busy }} disabled={busy} onPress={onReject} onHoverIn={event => focusHoveredMenuControl(event, language)}
            style={({ pressed }) => ({ minHeight: secondaryHeight, justifyContent: 'center', marginTop: secondaryFont * 0.5,
              opacity: busy ? 0.55 : pressed ? 0.80 : 1 })}>
            <Text aria-hidden numberOfLines={1} style={{ color: light.LIGHT_POPUP_SECONDARY_ACTION_COLOR,
              fontSize: secondaryFont, fontWeight: '700' }}>{copy.reject}</Text>
          </Pressable> : null}
        </View>
        </View>
      </View>
    </View>
  </AppOverlay>;
}

