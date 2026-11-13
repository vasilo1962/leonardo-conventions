import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import AppOverlay from '@/components/app-overlay';
import { APP_HEADER_TOP, APP_HEADER_HEIGHT_SHARE } from '@/components/app-header';
import Text from '@/components/app-text';
import PopupLanguageControl from '@/components/popup-language-control';
import { usePopupLanguage } from '@/hooks/use-popup-language';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import * as light from '@/lib/light-popup-style';
import { getMeasurementCopy } from '@/lib/measurement-consent-translations';
import { getInfoCopy } from '@/lib/info-popup-translations';
import useInfoMessageReading from '@/shared/accessibility/use-info-message-reading';
import {
  CONSENT_SETTINGS, getMeasurementConsent, setMeasurementConsent,
  subscribeMeasurementConsent,
} from '@/shared/analytics/measurement-consent';

import { getAdCountry, resolveAdCountry, subscribeAdCountry } from '@/shared/analytics/ad-country';

let homeMenus = 0;
const homeListeners = new Set<() => void>();
const subscribeHome = (listener: () => void) => {
  homeListeners.add(listener);
  return () => { homeListeners.delete(listener); };
};
const isHome = () => homeMenus > 0;

// Mounted only by the real home menu, after Auth/game restoration has resolved.
// Sidebar copies, lobbies and active games never mount this marker.
export function MeasurementConsentHome() {
  useEffect(() => {
    homeMenus += 1;
    homeListeners.forEach(listener => listener());
    return () => {
      homeMenus -= 1;
      homeListeners.forEach(listener => listener());
    };
  }, []);
  return null;
}

function anotherOverlay() {
  return typeof document !== 'undefined' && Array.from(document.querySelectorAll('[data-testid="app-overlay"]'))
    .some(node => !node.querySelector('[data-testid="measurement-consent"]'));
}
function subscribeOverlays(listener: () => void) {
  if (typeof document === 'undefined') return () => undefined;
  const observer = new MutationObserver(listener);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export default function MeasurementConsent() {
  const country = useSyncExternalStore(subscribeAdCountry, getAdCountry, () => 'unknown' as const);
  useEffect(() => { void resolveAdCountry(); }, []);
  const choice = useSyncExternalStore(subscribeMeasurementConsent, getMeasurementConsent, () => 'rejected' as const);
  const [dismissed, setDismissed] = useState(false);
  const [settings, setSettings] = useState(false);
  const [frameHeight, setFrameHeight] = useState(0);
  const occupied = useSyncExternalStore(subscribeOverlays, anotherOverlay, () => false);
  const home = useSyncExternalStore(subscribeHome, isHome, () => false);
  const visible = Platform.OS === 'web' && country === 'eligible' && !occupied && (settings || (home && choice === 'unknown' && !dismissed));
  const { width, height } = useWindowDimensions();
  const mobile = width < 768;
  const { language, playerLanguage, showEnglish, toggleLanguage } = usePopupLanguage(visible);
  const copy = getMeasurementCopy(language);
  const messageRef = useRef<unknown>(null);
  useInfoMessageReading(messageRef, visible, true, copy.message, language);
  const rtl = language === 'ar' || language === 'he';
  const font = (ratio: number) => responsiveHeightFontSize(height * ratio, width, height, mobile);
  const titleFont = font(light.LIGHT_POPUP_TITLE_FONT_RATIO);
  const messageFont = font(light.LIGHT_POPUP_MESSAGE_FONT_RATIO);
  const buttonFont = font(light.LIGHT_POPUP_BUTTON_FONT_RATIO);
  const padding = messageFont * light.LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO;
  const maxWidth = width * (mobile ? light.LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO : light.LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO);
  const labels = [copy.accept, copy.reject];
  const buttonWidth = light.getEqualLightPopupButtonWidth(labels, buttonFont)
    + Math.max(...labels.map(label => Array.from(label).length - 1))
      * buttonFont * light.LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO;
  const buttonHeight = light.getTranslatedLightPopupButtonHeight(buttonFont, mobile, true);
  const close = () => { setDismissed(true); setSettings(false); };
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const open = () => setSettings(true);
    window.addEventListener(CONSENT_SETTINGS, open);
    return () => window.removeEventListener(CONSENT_SETTINGS, open);
  }, []);
  return (
    <AppOverlay visible={visible} transparent announceContent={false} readPrimaryAction={false} onRequestClose={close}>
      <View style={[styles.overlay, { top: APP_HEADER_TOP + height * APP_HEADER_HEIGHT_SHARE }]}>
        <View testID="measurement-consent" role="dialog" aria-label={copy.title}
          {...{ lang: language }}
          onLayout={event => setFrameHeight(event.nativeEvent.layout.height)}
          style={{ maxWidth, maxHeight: '100%', flexShrink: 1, padding,
            borderWidth: height * light.LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO,
            borderColor: light.LIGHT_POPUP_FRAME_BORDER_COLOR,
            borderRadius: light.getLightPopupFrameRadius(frameHeight || padding * 2, height),
            backgroundColor: light.LIGHT_POPUP_FRAME_BACKGROUND_COLOR }}>
          <PopupLanguageControl showEnglish={showEnglish} playerLanguage={playerLanguage}
            variant="light" onClose={close} closeLabel={getInfoCopy(language, 'leonardoLeaderboard').close} onPress={toggleLanguage} />
          <Text scaleByDevice={false} accessibilityRole="header" style={{
            color: light.LIGHT_POPUP_TITLE_COLOR, fontSize: titleFont, fontWeight: '900',
            textAlign: 'center', letterSpacing: titleFont * light.LIGHT_POPUP_TITLE_LETTER_SPACING_TO_FONT_RATIO,
          }}>{copy.title}</Text>
          <ScrollView style={{ flexShrink: 1, flexGrow: 0, marginTop: titleFont * light.LIGHT_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO }}>
            <Text {...{ ref: (node: unknown) => { messageRef.current = node; },
              accessible: true, accessibilityLabel: copy.message, accessibilityLanguage: language, tabIndex: -1 as const }}
              scaleByDevice={false} style={{ color: light.LIGHT_POPUP_MESSAGE_COLOR,
              fontSize: messageFont, lineHeight: messageFont * light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO,
              textAlign: rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr',
            }}>{copy.message}</Text>
          </ScrollView>
          <View style={{ alignItems: 'center', gap: buttonFont * 0.35,
            marginTop: messageFont * light.LIGHT_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO }}>
            {(['accepted', 'rejected'] as const).map(value => (
              <Pressable key={value} accessibilityRole="button"
                accessibilityLabel={value === 'accepted' ? copy.accept : copy.reject}
                accessibilityLanguage={language}
                onHoverIn={event => {
                  const node = event.currentTarget as unknown;
                  if (typeof HTMLElement !== 'undefined' && node instanceof HTMLElement) {
                    node.setAttribute('lang', language);
                    if (document.activeElement !== node) node.focus({ preventScroll: true });
                  }
                }}
                onPress={() => { close(); setMeasurementConsent(value); }}
                style={({ pressed }) => ({ width: buttonWidth, height: buttonHeight,
                  alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.8 : 1,
                  borderWidth: height * light.LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
                  borderRadius: light.getLightPopupButtonRadius(buttonHeight),
                  borderColor: light.LIGHT_POPUP_SECONDARY_BUTTON_BORDER_COLOR,
                  backgroundColor: light.LIGHT_POPUP_SECONDARY_BUTTON_BACKGROUND_COLOR })}>
                <Text scaleByDevice={false} numberOfLines={1} style={{ fontSize: buttonFont,
                  fontWeight: '900', color: light.LIGHT_POPUP_BUTTON_COLOR,
                  letterSpacing: buttonFont * light.LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO,
                }}>{value === 'accepted' ? copy.accept : copy.reject}</Text>
              </Pressable>
            ))}
            <Link href="/privacy-policy" onPress={close} style={{ fontSize: buttonFont,
              color: light.LIGHT_POPUP_SECONDARY_ACTION_COLOR, textDecorationLine: 'underline',
              textAlign: 'center' }}>{copy.privacy}</Link>
          </View>
        </View>
      </View>
    </AppOverlay>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.60)' },
});
