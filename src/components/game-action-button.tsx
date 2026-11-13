import type { InfoLanguage } from '@/lib/info-popup-translations';
import usePlayerLanguage from '@/hooks/use-player-language';
import { gameControlName } from '@/shared/accessibility/game-control-name';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import Text from '@/components/app-text';
import {
  deviceScaledSize,
} from '@/lib/interface-scale';

export const GAME_ACTION_FONT_SIZE = 24;
export const GAME_ACTION_HEIGHT = GAME_ACTION_FONT_SIZE * 1.8;

type GameActionButtonProps = {
  label: string;
  onPress: PressableProps['onPress'];
  busy?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityLanguage?: InfoLanguage;
  style?: StyleProp<ViewStyle>;
  light?: boolean;
  fontSize?: number;
};

export default function GameActionButton({
  label,
  onPress,
  busy = false,
  disabled = false,
  accessibilityLabel,
  accessibilityLanguage,
  style,
  light = false,
  fontSize,
}: GameActionButtonProps) {
  const { language: playerLanguage } = usePlayerLanguage();
  const language = accessibilityLanguage ?? playerLanguage;
  const unavailable = disabled || busy;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLanguage={language} {...{ lang: language }}
      accessibilityLabel={accessibilityLabel ?? gameControlName(label, language)}
      accessibilityState={{ disabled: unavailable, busy }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fontSize === undefined ? null : {
          height: fontSize * 1.8,
          paddingHorizontal: fontSize,
        },
        light && styles.lightButton,
        style,
        pressed && !unavailable && styles.pressed,
        unavailable && styles.disabled,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={light ? '#faf4ee' : '#0a3c6a'} size="small" />
      ) : (
        <>
          <Text
            numberOfLines={1}
            style={[styles.label, fontSize === undefined ? null : { fontSize }, light && styles.lightLabel]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    height: deviceScaledSize(
      GAME_ACTION_HEIGHT
    ),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4b7198',
    borderRadius: 14,
    backgroundColor: '#edf3f8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
    elevation: 5,
  },
  label: {
    color: '#0a3c6a',
    fontSize: GAME_ACTION_FONT_SIZE,
    fontWeight: '900',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  lightButton: {
    borderColor: '#0a3c6a',
    backgroundColor: '#edf3f8',
  },
  lightLabel: {
    color: '#0a3c6a',
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.62,
  },
});
