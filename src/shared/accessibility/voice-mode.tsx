import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_CUSTOMIZE_PREFERENCES, parseCustomizePreferences, serializeCustomizePreferences, type CustomizePreferences } from '@/shared/preferences/customize-preferences';
import { supabase } from '@/lib/supabase';

type VoiceModeState = {
  enabled: boolean;
  ready: boolean;
  screenReader: boolean;
  soundsEnabled: boolean;
  saving: boolean;
  preferenceError: 'load' | 'save' | null;
  toggleScreenReader: () => void;
  toggleSounds: () => void;
  retryPreferences: () => void;
  toggle: () => void;
  menuIntroShown: boolean;
  markMenuIntroShown: () => void;
  sessionScope: string | null;
  claimDummyLayoutNotice: () => boolean;
};

const VoiceModeContext = createContext<VoiceModeState>({
  ...DEFAULT_CUSTOMIZE_PREFERENCES, ready: false, saving: false, preferenceError: null,
  toggle: () => undefined, toggleScreenReader: () => undefined, toggleSounds: () => undefined,
  retryPreferences: () => undefined,
  menuIntroShown: false, markMenuIntroShown: () => undefined,
  sessionScope: null, claimDummyLayoutNotice: () => false,
});

export function VoiceModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    ...DEFAULT_CUSTOMIZE_PREFERENCES, ready: false, saving: false,
    preferenceError: null as 'load' | 'save' | null,
    menuIntroShown: false, sessionScope: null as string | null,
  });
  const preferences = useRef<CustomizePreferences>({ ...DEFAULT_CUSTOMIZE_PREFERENCES });
  const pending = useRef(false);
  const retryLoad = useRef<() => void>(() => undefined);
  const account = useRef<string | null>(null);
  const revision = useRef(0);
  const writes = useRef(Promise.resolve());
  const introductions = useRef(new Map<string, boolean>());
  const dummyLayoutNotices = useRef(new Set<string>());

  const readMenuIntroShown = useCallback((key: string) => {
    if (introductions.current.has(key)) return introductions.current.get(key)!;
    let shown = false;
    try {
      if (typeof window !== 'undefined') {
        shown = window.sessionStorage.getItem(`${key}:menu-intro-shown`) === 'true';
      }
    } catch { /* Keep tab-lifetime memory when browser storage is unavailable. */ }
    introductions.current.set(key, shown);
    return shown;
  }, []);

  const saveMenuIntroShown = useCallback((key: string, shown: boolean) => {
    introductions.current.set(key, shown);
    try {
      if (typeof window !== 'undefined') {
        if (shown) window.sessionStorage.setItem(`${key}:menu-intro-shown`, 'true');
        else window.sessionStorage.removeItem(`${key}:menu-intro-shown`);
      }
    } catch { /* Navigation still retains the provider's in-memory state. */ }
  }, []);

  useEffect(() => {
    let active = true;
    let authRevision = 0;
    function applyAccount(userId: string | null, force = false) {
      const key = `leonardo:voice-mode:${userId ?? 'signed-out'}`;
      if (!force && account.current === key) return;
      account.current = key;
      pending.current = false;
      retryLoad.current = () => applyAccount(userId, true);
      const version = ++revision.current;
      setState({ ...DEFAULT_CUSTOMIZE_PREFERENCES, ready: false, saving: false,
        preferenceError: null, menuIntroShown: false, sessionScope: key });
      void writes.current.catch(() => undefined).then(() => AsyncStorage.getItem(key)).then(value => {
        if (active && version === revision.current) {
          const saved = parseCustomizePreferences(value);
          preferences.current = saved;
          if (!saved.enabled || saved.screenReader) saveMenuIntroShown(key, saved.screenReader);
          setState({ ...saved, ready: true, saving: false, preferenceError: null,
            menuIntroShown: saved.enabled && readMenuIntroShown(key), sessionScope: key });
        }
      }).catch(() => {
        if (active && version === revision.current) {
          setState({ ...DEFAULT_CUSTOMIZE_PREFERENCES, ready: false, saving: false,
            preferenceError: 'load', menuIntroShown: false, sessionScope: key });
        }
      });
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      authRevision += 1;
      applyAccount(session?.user.id ?? null);
    });
    const initialRevision = authRevision;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && authRevision === initialRevision) {
        applyAccount(data.session?.user.id ?? null);
      }
    }).catch(() => {
      if (active && authRevision === initialRevision) applyAccount(null);
    });
    return () => {
      active = false;
      revision.current += 1;
      account.current = null;
      retryLoad.current = () => undefined;
      data.subscription.unsubscribe();
    };
  }, [readMenuIntroShown, saveMenuIntroShown]);

  function changePreference(field: keyof CustomizePreferences) {
    const key = account.current;
    if (!state.ready || !key || pending.current || key !== state.sessionScope) return;
    const previous = preferences.current;
    if (field === 'enabled' && previous.screenReader) return;
    const next = { ...previous, [field]: !previous[field] };
    if (next.screenReader) next.enabled = true;
    pending.current = true;
    const version = ++revision.current;
    setState(current => ({ ...current, saving: true, preferenceError: null }));
    writes.current = writes.current.catch(() => undefined).then(async () => {
      try {
        await AsyncStorage.setItem(key, serializeCustomizePreferences(next));
        if (account.current === key && revision.current === version) {
          preferences.current = next;
          pending.current = false;
          if (!next.enabled || next.screenReader) saveMenuIntroShown(key, next.screenReader);
          setState({ ...next, ready: true, saving: false, preferenceError: null,
            menuIntroShown: next.enabled && readMenuIntroShown(key), sessionScope: key });
        }
      } catch {
        if (account.current === key && revision.current === version) {
          pending.current = false;
          setState(current => ({ ...current, saving: false, preferenceError: 'save' }));
        }
      }
    });
  }

  const markMenuIntroShown = useCallback(() => {
    const key = account.current;
    if (!key || key !== state.sessionScope || !state.ready || !state.enabled || state.menuIntroShown) return;
    saveMenuIntroShown(key, true);
    setState(previous => ({ ...previous, menuIntroShown: true }));
  }, [state.ready, state.enabled, state.menuIntroShown, state.sessionScope, saveMenuIntroShown]);

  // Separate from the menu introduction: toggling Voice Mode does not reset this notice.
  const claimDummyLayoutNotice = useCallback(() => {
    const key = account.current;
    if (!key || key !== state.sessionScope || !state.ready || !state.enabled) return false;
    const storageKey = `${key}:dummy-layout-notice-shown`;
    if (dummyLayoutNotices.current.has(storageKey)) return false;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey) === 'true') {
        dummyLayoutNotices.current.add(storageKey);
        return false;
      }
    } catch { /* Keep the provider's session memory when storage is unavailable. */ }
    dummyLayoutNotices.current.add(storageKey);
    try {
      if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, 'true');
    } catch { /* The in-memory claim still prevents another notice during navigation. */ }
    return true;
  }, [state.ready, state.enabled, state.sessionScope]);

  return (
    <VoiceModeContext.Provider value={{ ...state, toggle: () => changePreference('enabled'),
      toggleScreenReader: () => changePreference('screenReader'),
      toggleSounds: () => changePreference('soundsEnabled'),
      retryPreferences: () => retryLoad.current(), markMenuIntroShown, claimDummyLayoutNotice }}>
      {children}
    </VoiceModeContext.Provider>
  );
}

export function useVoiceMode() {
  return useContext(VoiceModeContext);
}
