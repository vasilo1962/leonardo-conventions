import usePlayerLanguage from '@/hooks/use-player-language';
import { gameControlName } from '@/shared/accessibility/game-control-name';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import Text from '@/components/app-text';
import { responsiveHeightFontSize } from '@/lib/interface-scale';

type BackLinkProps = {
  label?: string;
  accessibilityLabel?: string;
  onPress: () => void;
  alignWithExit?: boolean;
  inheritLanguage?: boolean;
  hoverAccessibility?: boolean;
};

export default function BackLink({
  label = 'Back',
  accessibilityLabel,
  onPress,
  alignWithExit = false,
  inheritLanguage = false,
  hoverAccessibility = false,
}: BackLinkProps) {
  const { language } = usePlayerLanguage();
  const { width, height } = useWindowDimensions();
  const fontSize = responsiveHeightFontSize(
    height * 0.021,
    width,
    height,
    width < 768
  );

  const link = (
    <Pressable
      accessibilityRole="button"
      {...(inheritLanguage ? {} : { accessibilityLanguage: language, lang: language })}
      accessibilityLabel={accessibilityLabel ?? gameControlName(label, language)}
      onPress={onPress}
      onHoverIn={hoverAccessibility ? event => focusHoveredMenuControl(event, language) : undefined}
      style={({ pressed }) => [
        styles.link,
        { marginTop: fontSize * 1.5 },
        pressed && styles.pressed,
      ]}
    >
      <Text
        scaleByDevice={false}
        style={[
          styles.text,
          {
            fontSize,
            lineHeight: fontSize,
          },
        ]}
      >
        ← {label}
      </Text>
    </Pressable>
  );

  return alignWithExit ? (
    <View style={{ width: width * 0.94, alignSelf: 'center' }}>{link}</View>
  ) : link;
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
  },
  text: {
    color: '#0a3c6a',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.84,
  },
});
