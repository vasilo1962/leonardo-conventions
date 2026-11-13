type AccountStorage = Pick<Storage, 'length' | 'key' | 'getItem' | 'removeItem'>;

// Only Leonardo-owned keys are considered; unrelated origin data and other users' drafts remain.
export function clearDeletedAccountStorage(userId: string, clearCurrentCaches = true,
  storages: AccountStorage[] = [window.localStorage, window.sessionStorage]) {
  for (const storage of storages) {
    const keys: string[] = [];
    try {
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (key) keys.push(key);
      }
      for (const rawKey of keys) {
        // AsyncStorage's web implementation wraps keys in this namespace.
        const key = rawKey.replace(/^@AsyncStorage:/, '');
        const owned = ['bridgeduel:', 'bridge-duel-', 'leonardo:', 'leonardobridge:']
          .some(prefix => key.startsWith(prefix));
        if (!owned) continue;
        const scopedToDeletedUser = key.includes(userId) || (storage.getItem(rawKey) ?? '').includes(userId);
        // These older caches have no owner field. They are disposable copies of server state.
        const currentCache = clearCurrentCaches && (
          key.startsWith('bridgeduel:deal-checkpoint:') || key.startsWith('bridgeduel:practice-retry:')
          || key.startsWith('bridgeduel:retry:') || key === 'leonardobridge:facebook-first'
          || key === 'leonardobridge:google-search-first' || key === 'leonardobridge:measurement-revocations');
        if (scopedToDeletedUser || currentCache) storage.removeItem(rawKey);
      }
    } catch { /* Storage unavailable; in-memory state is discarded by the reload. */ }
  }
}
