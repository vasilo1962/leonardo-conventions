import { TableInvitationPreference } from '@/features/table-invitations/ui';
import { unlockGameAudio } from '@/shared/sounds/game-sounds';
import { ActivityIndicator, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { getSystemPopupCopy } from '@/lib/system-popup-translations';
import usePlayerLanguage from '@/hooks/use-player-language';
import { getCustomizeCopy } from '@/lib/customize-translations';
import { responsiveHeightFontSize, textFrameHeight } from '@/lib/interface-scale';
import { BLUE_POPUP_MESSAGE_FONT_RATIO, BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO,
  BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO } from '@/lib/blue-popup-style';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';

export default function CustomizeSettings({ onClose }: { onClose: () => void }) {
  const preferences = useVoiceMode();
  const { language } = usePlayerLanguage();
  const copy = getCustomizeCopy(language);
  const close = getSystemPopupCopy(language).close;
  // Native uses accessibilityLanguage; the web host also receives its HTML language.
  const languageProps = {
    accessibilityLanguage: language,
    ...(Platform.OS === 'web' ? { lang: language } : {}),
  };
  const { width, height } = useWindowDimensions();
  const font = responsiveHeightFontSize(height * BLUE_POPUP_MESSAGE_FONT_RATIO, width, height, width < 768);
  const closeFont = responsiveHeightFontSize(height * 0.021, width, height, width < 768);
  const disabled = !preferences.ready || preferences.saving;
  const rows = [
    { id: 'sounds', label: copy.sounds, checked: preferences.soundsEnabled, toggle: () => {
      if (!preferences.soundsEnabled) unlockGameAudio();
      preferences.toggleSounds();
    } },
    { id: 'screen-reader', label: copy.screenReader, checked: preferences.screenReader, toggle: preferences.toggleScreenReader },
  ];
  return (
    <View testID="account-customize-panel" style={{ gap: font * 0.7 }}>
      {preferences.ready ? rows.map(row => (
        <Pressable key={row.id} testID={`customize-${row.id}`} accessibilityRole="checkbox"
          {...languageProps} accessibilityLabel={row.label}
          aria-checked={row.checked} accessibilityState={{ checked: row.checked, disabled, busy: preferences.saving }}
          disabled={disabled} onPress={row.toggle}
          onHoverIn={event => focusHoveredMenuControl(event, language)}
          style={{ minHeight: textFrameHeight(font), flexDirection: 'row',
            alignItems: 'center', gap: font * 0.5, opacity: disabled ? 0.55 : 1 }}>
          <View aria-hidden accessible={false} style={{
            width: font, height: font, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
            borderWidth: height * BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO, borderColor: '#4b7198',
            backgroundColor: row.checked ? '#0a3c6a' : '#edf3f8',
          }}>
            {row.checked ? <Text accessible={false} style={{ color: '#fff', fontSize: font * 0.8, lineHeight: font }}>✓</Text> : null}
          </View>
          <Text aria-hidden accessible={false} style={{
            flexShrink: 1, color: '#0a3c6a', fontSize: font, textAlign: 'left',
            lineHeight: font * BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO,
            writingDirection: language === 'ar' || language === 'he' ? 'rtl' : 'ltr',
          }}>{row.label}</Text>
        </Pressable>
      )) : !preferences.preferenceError ? (
        <Text accessibilityLanguage={language} style={{ color: '#4b7198', fontSize: font }}>{copy.loading}</Text>
      ) : null}
      <TableInvitationPreference />
      {preferences.saving ? <ActivityIndicator color="#0a3c6a" /> : null}
      {preferences.preferenceError ? <>
        <Text accessibilityRole="alert" {...languageProps}
          style={{ color: '#0a3c6a', fontSize: font, lineHeight: font * BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO }}>
          {preferences.preferenceError === 'load' ? copy.loadFailed : copy.saveFailed}
        </Text>
        {preferences.preferenceError === 'load' ? <Pressable testID="customize-retry"
          accessibilityRole="button" accessibilityLabel={copy.retry} accessibilityLanguage={language}
          onHoverIn={event => focusHoveredMenuControl(event, language)} onPress={preferences.retryPreferences}>
          <Text style={{ color: '#0a3c6a', fontSize: font, textDecorationLine: 'underline' }}>{copy.retry}</Text>
        </Pressable> : null}
      </> : null}
      <Pressable testID="customize-close" accessibilityRole="button"
        {...languageProps} accessibilityLabel={close} onPress={onClose}
        onHoverIn={event => focusHoveredMenuControl(event, language)}
        style={({ pressed }) => ({
          alignSelf: 'flex-start', marginTop: closeFont * 1.5, opacity: pressed ? 0.84 : 1,
        })}>
        <Text style={{ color: '#0a3c6a', fontSize: closeFont, lineHeight: closeFont, fontWeight: '700' }}>
          {close}
        </Text>
      </Pressable>
    </View>
  );
}
