import type { ComponentProps, ReactNode } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import AppHeader, {
  APP_HEADER_HEIGHT_SHARE,
  APP_HEADER_TOP,
} from '@/components/app-header';

type AppScreenFrameProps = ComponentProps<typeof AppHeader> & {
  children: ReactNode;
  hideHeader?: boolean;
};

const APP_HEADER_BOTTOM_GAP_SHARE = 0.008;

export default function AppScreenFrame({
  children,
  lightTheme = false,
  hideHeader = false,
  ...headerProps
}: AppScreenFrameProps) {
  const { height } = useWindowDimensions();
  const headerReservedHeight =
    APP_HEADER_TOP
    + height * APP_HEADER_HEIGHT_SHARE
    + height * APP_HEADER_BOTTOM_GAP_SHARE;

  return (
    <View style={[styles.frame, lightTheme && styles.lightFrame]}>
      {hideHeader ? null : (
        <>
          <AppHeader {...headerProps} lightTheme={lightTheme} />
          <View
            pointerEvents="none"
            style={[styles.headerSpace, { height: headerReservedHeight }]}
          />
        </>
      )}
      <View nativeID="ai-help-page-content" style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#faf4ee',
  },
  lightFrame: {
    backgroundColor: '#faf4ee',
  },
  headerSpace: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
});

