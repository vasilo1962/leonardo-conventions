import type { InfoLanguage } from '@/lib/info-popup-translations';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';

import usePopupPrimaryAction from '@/shared/accessibility/use-popup-primary-action';
import usePopupAnnouncements from '@/shared/accessibility/use-popup-announcements';

type AppOverlayProps = {
  visible?: boolean;
  announceContent?: boolean;
  // Disable when this popup already owns reading through focus or a live announcement; Enter remains available.
  readPrimaryAction?: boolean;
  primaryActionAnnouncement?: { text: string; language: InfoLanguage; instruction?: string };
  children: ReactNode;
  onRequestClose?: () => void;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  statusBarTranslucent?: boolean;
  fixedToViewport?: boolean;
  stackingOrder?: number;
};

type VisibleAppOverlayProps = Omit<AppOverlayProps, 'visible'>;

function VisibleAppOverlay({
  children,
  onRequestClose,
  animationType = 'none',
  announceContent = true,
  primaryActionAnnouncement,
  readPrimaryAction = true,
  fixedToViewport = false,
  stackingOrder,
}: VisibleAppOverlayProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  usePopupPrimaryAction(hostRef, primaryActionAnnouncement, readPrimaryAction);
  usePopupAnnouncements(hostRef, animationType, announceContent);

  const [opacity] = useState(() => new Animated.Value(
    animationType === 'fade' ? 0 : 1
  ));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: animationType === 'fade' ? 180 : 0,
      useNativeDriver: true,
    }).start();
  }, [animationType, opacity]);

  useEffect(() => {
    if (!onRequestClose || typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRequestClose]);

  return (
    <Animated.View
      testID="app-overlay"
      ref={node => { hostRef.current = node as unknown as HTMLElement | null; }}
      pointerEvents="box-none"
      style={[
        styles.host,
        fixedToViewport && styles.viewportHost,
        stackingOrder === undefined
          ? null
          : { zIndex: stackingOrder, elevation: stackingOrder },
        { opacity },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export default function AppOverlay({
  visible = true,
  ...props
}: AppOverlayProps) {
  if (!visible) {
    return null;
  }

  return <VisibleAppOverlay {...props} />;
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    zIndex: 400,
    elevation: 400,
  },
  viewportHost: {
    ...(Platform.OS === 'web'
      ? { position: 'fixed' as 'absolute' }
      : null),
  },
});

