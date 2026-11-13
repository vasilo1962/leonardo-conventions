import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

export function usePublicReader() {
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !active) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .maybeSingle();
      if (active && profile?.username) setUsername(profile.username);
    })();
    return () => { active = false; };
  }, []);

  return { username, canOpenTables: true };
}
