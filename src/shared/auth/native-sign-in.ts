import { supabase } from '@/lib/supabase';
import { signInWithGoogleCredential } from './google-sign-in';

type Provider = 'google' | 'apple';
type SocialLogin = {
  initialize: (options: Record<string, unknown>) => Promise<void>;
  login: (options: { provider: Provider; options: Record<string, unknown> }) => Promise<{ result: { idToken: string | null; accessToken?: { token?: string }; authorizationCode?: string } }>;
  logout: (options: { provider: Provider; clearCachedUserInfo?: boolean }) => Promise<void>;
};
type NativeWindow = Window & {
  Capacitor?: { isNativePlatform: () => boolean; getPlatform: () => string };
  capacitorCapacitorUpdater?: { SocialLogin: SocialLogin };
};
let initialization: Promise<void> | null = null;
let revision = 0;
let credentialExchange: Promise<void> | null = null;

export function isIPhoneApp(): boolean {
  if (typeof window === 'undefined') return false;
  const capacitor = (window as NativeWindow).Capacitor;
  return Boolean(capacitor?.isNativePlatform() && capacitor.getPlatform() === 'ios');
}
function plugin(): SocialLogin {
  const social = (window as NativeWindow).capacitorCapacitorUpdater?.SocialLogin;
  if (!social) throw new Error('Native sign-in unavailable');
  return social;
}
async function initialize() {
  if (!initialization) {
    initialization = plugin().initialize({
      google: {
        iOSClientId: '490544322196-e87carhcscl9qccfu43cbtm5onvc0use.apps.googleusercontent.com',
        iOSServerClientId: '490544322196-08qnrkteiop07tliluqf2h92e4mvv79g.apps.googleusercontent.com',
        mode: 'online',
      },
      apple: { clientId: 'com.leonardobridge.app' },
    }).catch(error => { initialization = null; throw error; });
  }
  await initialization;
}
export function invalidateNativeSignIn() { revision += 1; }

export async function signInOnIPhone(provider: Provider) {
  const attempt = ++revision;
  await initialize();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const startingUser = data.session?.user.id ?? null;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce));
  const hashed = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  // Never silently restore the previous Google account.
  if (provider === 'google') await plugin().logout({ provider });
  if (attempt !== revision) return;
  const response = await plugin().login({
    provider,
    options: { nonce: hashed, ...(provider === 'google' ? { scopes: ['email', 'profile'], forcePrompt: true } : { scopes: ['email', 'name'] }) },
  });
  if (attempt !== revision) return;
  const current = await supabase.auth.getSession();
  if (current.error) throw current.error;
  if ((current.data.session?.user.id ?? null) !== startingUser || attempt !== revision) return;
  if (!response.result.idToken) throw new Error('Missing identity token');
  const exchange = signInWithGoogleCredential(response.result.idToken, nonce, provider);
  credentialExchange = exchange;
  try { await exchange; }
  finally { if (credentialExchange === exchange) credentialExchange = null; }
}

// Invalidate an open chooser immediately; finish any auth mutation before sign-out.
export async function prepareIPhoneSignOut() {
  invalidateNativeSignIn();
  await credentialExchange?.catch(() => undefined);
}

export async function clearIPhoneProviderSessions(clearCachedUserInfo = false) {
  invalidateNativeSignIn();
  if (!isIPhoneApp()) return;
  await initialize();
  await Promise.allSettled(['google', 'apple'].map(provider =>
    plugin().logout({ provider: provider as Provider, ...(clearCachedUserInfo ? { clearCachedUserInfo: true } : {}) })));
}

// The pinned plugin's legacy Apple mode returns the raw one-use code as accessToken.token.
// This chooser verifies deletion consent without signing into or linking another Supabase account.
export async function appleAccountDeletionCode(): Promise<string> {
  await prepareIPhoneSignOut();
  await initialize();
  const response = await plugin().login({ provider: 'apple', options: { scopes: ['email'] } });
  const code = response.result.authorizationCode ?? response.result.accessToken?.token;
  if (!code) throw new Error('Apple authorization code unavailable');
  return code;
}
