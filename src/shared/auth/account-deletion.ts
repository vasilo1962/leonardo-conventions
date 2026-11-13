import { clearDeletedAccountStorage } from './deleted-account-storage';
import { supabase } from '@/lib/supabase';
import { appleAccountDeletionCode, clearIPhoneProviderSessions, prepareIPhoneSignOut } from './native-sign-in';

let pending = false;

// The ID is captured when confirmation is opened, never inferred after the Apple chooser.
export async function deleteConfirmedAccount(expectedUserId: string) {
  if (pending) throw new Error('Deletion already pending');
  pending = true;
  try {
    await prepareIPhoneSignOut();
    const initial = await supabase.auth.getSession();
    if (initial.error || initial.data.session?.user.id !== expectedUserId) throw new Error('Account changed');
    // Server-verified identities decide whether Apple revocation is needed.
    const verified = await supabase.auth.getUser();
    if (verified.error || verified.data.user?.id !== expectedUserId) throw new Error('Account changed');
    const needsApple = verified.data.user.identities?.some(identity => identity.provider === 'apple');
    const appleAuthorizationCode = needsApple ? await appleAccountDeletionCode() : undefined;
    const current = await supabase.auth.getSession();
    if (current.error || current.data.session?.user.id !== expectedUserId) throw new Error('Account changed');
    const response = await fetch('/api/account/delete', {
      method: 'POST', credentials: 'omit', cache: 'no-store',
      headers: { Authorization: 'Bearer ' + current.data.session.access_token,
        'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'DELETE', ...(appleAuthorizationCode ? { appleAuthorizationCode } : {}) }),
    });
    if (response.status !== 204) throw new Error('Account deletion unavailable');
    const after = await supabase.auth.getSession();
    clearDeletedAccountStorage(expectedUserId, after.data.session?.user.id === expectedUserId);
    // A late response must never sign out a newly selected account.
    if (after.data.session?.user.id === expectedUserId) {
      const result = await supabase.auth.signOut({ scope: 'local' });
      if (result.error) throw new Error('Local session cleanup failed');
      await clearIPhoneProviderSessions(true);
      clearDeletedAccountStorage(expectedUserId);
      // Reload drops all in-memory page/profile/game caches before a new guest can be created.
      window.location.replace('/');
    }
  } finally { pending = false; }
}
