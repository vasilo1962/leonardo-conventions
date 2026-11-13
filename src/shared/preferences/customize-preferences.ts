// One atomic account/device record; legacy Voice Mode booleans remain readable.
export type CustomizePreferences = {
  enabled: boolean;
  screenReader: boolean;
  soundsEnabled: boolean;
};
export const DEFAULT_CUSTOMIZE_PREFERENCES: CustomizePreferences = {
  enabled: false, screenReader: false, soundsEnabled: false,
};
export function parseCustomizePreferences(value: string | null): CustomizePreferences {
  if (value === null || value === 'true' || value === 'false') {
    return { ...DEFAULT_CUSTOMIZE_PREFERENCES, enabled: value === 'true' };
  }
  const saved: unknown = JSON.parse(value);
  if (!saved || typeof saved !== 'object' || !('version' in saved) || saved.version !== 1
    || !('enabled' in saved) || typeof saved.enabled !== 'boolean'
    || !('screenReader' in saved) || typeof saved.screenReader !== 'boolean'
    || !('soundsEnabled' in saved) || typeof saved.soundsEnabled !== 'boolean') {
    throw new Error('Unsupported customization record');
  }
  return { enabled: saved.enabled || saved.screenReader,
    screenReader: saved.screenReader, soundsEnabled: saved.soundsEnabled };
}
export function serializeCustomizePreferences(preferences: CustomizePreferences): string {
  return JSON.stringify({ version: 1, ...preferences, enabled: preferences.enabled || preferences.screenReader });
}
