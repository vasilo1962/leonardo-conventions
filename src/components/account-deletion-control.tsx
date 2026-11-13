import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, useWindowDimensions, View } from 'react-native';
import Text from '@/components/app-text';
import usePlayerLanguage from '@/hooks/use-player-language';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { ACCOUNT_DELETION_COPY } from '@/lib/account-deletion-copy';
import { getAuthCopy } from '@/lib/auth-translations';
import { responsiveHeightFontSize, textFrameHeight } from '@/lib/interface-scale';
import { LIGHT_POPUP_SECONDARY_ACTION_FONT_RATIO } from '@/lib/light-popup-style';
import { supabase } from '@/lib/supabase';
import { deleteConfirmedAccount } from '@/shared/auth/account-deletion';
import { isIPhoneApp } from '@/shared/auth/native-sign-in';

// Confirmation expands inside the existing account menu or auth form: no second overlay.
export default function AccountDeletionControl({ disabled = false, language: preferredLanguage }: { disabled?: boolean; language?: InfoLanguage }) {
  const { width, height } = useWindowDimensions();
  const { language: playerLanguage } = usePlayerLanguage();
  const language = preferredLanguage ?? playerLanguage;
  const copy = ACCOUNT_DELETION_COPY[language];
  const font = responsiveHeightFontSize(height * LIGHT_POPUP_SECONDARY_ACTION_FONT_RATIO,
    width, height, width < 768);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const active = useRef(true);
  const submitting = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);

  async function open() {
    if (submitting.current || disabled) return;
    submitting.current = true;
    setBusy(true); setError(false);
    try {
      const { data, error: failure } = await supabase.auth.getSession();
      if (failure || !data.session) throw new Error('No session');
      if (active.current) setUserId(data.session.user.id);
    } catch { if (active.current) setError(true); }
    finally {
      submitting.current = false;
      if (active.current) setBusy(false);
    }
  }
  async function confirm() {
    if (submitting.current || !userId || disabled) return;
    submitting.current = true;
    setBusy(true); setError(false);
    try { await deleteConfirmedAccount(userId); }
    catch (failure) {
      const detail = String((failure as { code?: unknown })?.code ?? '') + ' ' +
        String((failure as { message?: unknown })?.message ?? '');
      if (active.current && !/cancel/i.test(detail)) setError(true);
    } finally {
      submitting.current = false;
      if (active.current) setBusy(false);
    }
  }
  if (!isIPhoneApp()) return null;
  return <View style={{ alignItems: 'center', alignSelf: 'stretch', gap: font * 0.35 }}>
    {userId ? <>
      <Text accessibilityLanguage={language} scaleByDevice={false}
        style={{ fontSize: font, lineHeight: font * 1.30, color: '#4b7198', textAlign: 'center' }}>{copy.warning}</Text>
      <DeletionAction label={copy.cancel} onPress={() => { setUserId(null); setError(false); }}
        testID="account-delete-cancel" disabled={disabled} busy={busy} language={language} font={font} />
      <DeletionAction label={copy.remove} onPress={confirm}
        testID="account-delete-confirm" disabled={disabled} busy={busy} language={language} font={font} />
    </> : <DeletionAction label={copy.title} onPress={open}
      testID="account-delete-open" disabled={disabled} busy={busy} language={language} font={font} />}
    {busy ? <ActivityIndicator color="#0a3c6a" /> : null}
    {error ? <Text accessibilityRole="alert" accessibilityLanguage={language} scaleByDevice={false}
      style={{ fontSize: font, lineHeight: font * 1.30, color: '#4b7198', textAlign: 'center' }}>
      {getAuthCopy(language).tryAgain}
    </Text> : null}
  </View>;
}

function DeletionAction({ label, onPress, testID, disabled, busy, language, font }: {
  label: string; onPress: () => void; testID: string; disabled: boolean; busy: boolean;
  language: InfoLanguage; font: number;
}) {
  return (
    <Pressable key={testID} testID={testID} accessibilityRole="button"
      accessibilityLabel={label} accessibilityLanguage={language}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy} onPress={onPress}
      style={{ minHeight: textFrameHeight(font), justifyContent: 'center', alignItems: 'center' }}>
      <Text scaleByDevice={false} style={{ fontSize: font, lineHeight: font * 1.30,
        color: '#0a3c6a', textAlign: 'center', fontWeight: '700', textDecorationLine: 'underline' }}>{label}</Text>
    </Pressable>
  );
}

