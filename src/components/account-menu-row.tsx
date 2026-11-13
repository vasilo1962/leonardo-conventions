import { ActivityIndicator, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import { BLUE_POPUP_BUTTON_FONT_RATIO, BLUE_POPUP_TITLE_COLOR, BLUE_POPUP_MESSAGE_COLOR } from '@/lib/blue-popup-style';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';

export function accountMenuFontSize(width: number, height: number) {
  return responsiveHeightFontSize(height * BLUE_POPUP_BUTTON_FONT_RATIO, width, height, width < 768);
}
type MenuIcon = 'settings' | 'friends' | 'sign-out' | 'sign-in';
export function MenuGlyph({ name, size }: { name: MenuIcon; size: number }) {
  const fallback = { settings: '⚙', friends: '♙♙', 'sign-out': '⇥', 'sign-in': '⇤' };
  return <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {Platform.OS === 'web' ? <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={BLUE_POPUP_MESSAGE_COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {name === 'settings' ? <><path d="M3 6h7m4 0h7M3 12h3m4 0h11M3 18h11m4 0h3" />
        <circle cx="12" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></>
      : name === 'friends' ? <><circle cx="8" cy="8" r="3" /><path d="M2 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 4 5v1" /></>
      : <><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
        {name === 'sign-out' ? <path d="m15 8 4 4-4 4M9 12h10" /> : <path d="m13 8-4 4 4 4M9 12h12" />}</>}
    </svg> : <Text accessible={false} style={{ color: BLUE_POPUP_MESSAGE_COLOR, fontSize: size, lineHeight: size }}>{fallback[name]}</Text>}
  </View>;
}

export default function AccountMenuRow({ label, language, icon, onPress, disabled = false, busy = false, testID }: {
  label: string; language: InfoLanguage; icon: MenuIcon; onPress: () => void;
  disabled?: boolean; busy?: boolean; testID?: string;
}) {
  const { width, height } = useWindowDimensions();
  const font = accountMenuFontSize(width, height);
  const iconSize = font * 1.15;
  const rtl = language === 'ar' || language === 'he';
  return <Pressable testID={testID} accessibilityRole="menuitem" accessibilityLabel={label}
    accessibilityLanguage={language} {...{ lang: language }} accessibilityState={{ disabled: disabled || busy, busy }}
    disabled={disabled || busy} onPress={onPress} onHoverIn={event => focusHoveredMenuControl(event, language)}
    style={({ pressed }) => ({ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center',
      gap: font * 0.75, minHeight: font * 3, paddingVertical: font * 0.5,
      opacity: disabled || busy ? 0.55 : pressed ? 0.80 : 1 })}>
    {busy ? <View aria-hidden style={{ width: iconSize, height: iconSize }}><ActivityIndicator color={BLUE_POPUP_TITLE_COLOR} size="small" /></View>
      : <MenuGlyph name={icon} size={iconSize} />}
    <Text aria-hidden style={{ flexShrink: 1, color: BLUE_POPUP_TITLE_COLOR, fontSize: font,
      lineHeight: font * 1.3, fontWeight: '600', textAlign: 'left', writingDirection: rtl ? 'rtl' : 'ltr' }}>{label}</Text>
  </Pressable>;
}
