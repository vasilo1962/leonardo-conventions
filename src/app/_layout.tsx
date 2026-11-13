import { Stack } from 'expo-router';
import { VoiceModeProvider } from '@/shared/accessibility/voice-mode';
import VoiceModeCaption from '@/shared/accessibility/voice-mode-caption';
import { MenuNavigationAnnouncer } from '@/shared/accessibility/menu-navigation-announcements';
import MeasurementConsent from '@/components/measurement-consent';
export default function RootLayout() {
  return <VoiceModeProvider><Stack screenOptions={{headerShown:false}} /><MenuNavigationAnnouncer /><VoiceModeCaption /><MeasurementConsent /></VoiceModeProvider>;
}
