import { supabase } from '@/lib/supabase';

export const GOOGLE_CLIENT_ID =
  '490544322196-08qnrkteiop07tliluqf2h92e4mvv79g.apps.googleusercontent.com';

// Use the same verified provider credential for both outcomes. No sign-out,
// second account chooser, or data migration is needed.
export async function signInWithGoogleCredential(token: string, nonce: string, provider: 'google' | 'apple' = 'google') {
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const credentials = { provider, token, nonce };
  if (data.session?.user.is_anonymous) {
    const { error } = await supabase.auth.linkIdentity(credentials);
    if (!error) return;
    if (error.code !== 'identity_already_exists' && error.code !== 'email_exists') {
      throw error;
    }
  }

  const { error } = await supabase.auth.signInWithIdToken(credentials);
  if (error) throw error;
}
