import { supabase } from '@/lib/supabase';

export type DailyPoints = { bridge_day: string; points: number };
export type PointsPage = { rows: DailyPoints[]; next_before: string | null; total_points: number;
  practice_points?: number; tournament_points?: number };

async function readPoints(rpc: string, before: string | null): Promise<PointsPage> {
  const { data, error } = await supabase.rpc(rpc, {
    p_limit: 90, p_before: before,
  });
  if (error) throw error;
  const page = data as PointsPage;
  if (!page || !Array.isArray(page.rows) || !Number.isFinite(page.total_points)
    || page.rows.some(row => !/^\d{4}-\d{2}-\d{2}$/.test(row.bridge_day) || !Number.isFinite(row.points))
    || (page.next_before !== null && !/^\d{4}-\d{2}-\d{2}$/.test(page.next_before))) {
    throw new Error('Invalid daily points response');
  }
  return page;
}

export const loadDailyPoints = (before: string | null = null) => readPoints('get_player_daily_points', before);
export const loadPracticeDailyPoints = (before: string | null = null) => readPoints('get_player_practice_daily_points', before);

export const leonardoPoints = (points: number) => points / 1000;

// Both sources must cover the same cursor window before daily amounts are added.
export async function loadLeonardoDailyPoints(before: string | null = null): Promise<PointsPage> {
  const [practice, tournament] = await Promise.all([
    loadPracticeDailyPoints(before), loadDailyPoints(before),
  ]);
  const cursors = [practice.next_before, tournament.next_before].filter((day): day is string => day !== null);
  const next_before = cursors.sort().at(-1) ?? null;
  const days = new Map<string, number>();
  for (const row of [...practice.rows, ...tournament.rows]) {
    if (next_before !== null && row.bridge_day < next_before) continue;
    days.set(row.bridge_day, (days.get(row.bridge_day) ?? 0) + row.points);
  }
  return {
    rows: [...days].map(([bridge_day, value]) => ({ bridge_day, points: leonardoPoints(value) }))
      .sort((a, b) => b.bridge_day.localeCompare(a.bridge_day)),
    next_before,
    total_points: leonardoPoints(practice.total_points + tournament.total_points),
    practice_points: leonardoPoints(practice.total_points),
    tournament_points: leonardoPoints(tournament.total_points),
  };
}

export function pointsLabel(points: number, locale?: string): string {
  return points.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Pages are strictly older than their cursor. Keep one row for each actual Bridge day.
export function mergePointDays(rows: DailyPoints[], next: DailyPoints[]): DailyPoints[] {
  const days = new Map(rows.map(row => [row.bridge_day, row]));
  for (const row of next) days.set(row.bridge_day, row);
  return [...days.values()].sort((a, b) => b.bridge_day.localeCompare(a.bridge_day));
}

export function createPointsLoader(read = loadDailyPoints) {
  type State = { page: PointsPage | null; pending: boolean; error: boolean };
  let state: State = { page: null, pending: false, error: false };
  let version = 0, active = true;
  const listeners = new Set<() => void>();
  const publish = (next: State) => {
    state = next; listeners.forEach(listener => listener());
  };
  const request = async (before: string | null) => {
    if (!active || state.pending) return;
    const token = ++version;
    publish({ ...state, pending: true, error: false });
    try {
      const page = await read(before);
      if (!active || token !== version) return;
      publish({ page: { ...page, rows: before ? mergePointDays(state.page?.rows ?? [], page.rows) : page.rows },
        pending: false, error: false });
    } catch {
      if (active && token === version) publish({ ...state, pending: false, error: true });
    }
  };
  return {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    activate() { active = true; },
    load: () => request(null),
    more: () => state.page?.next_before ? request(state.page.next_before) : Promise.resolve(),
    retry: () => request(state.page?.next_before ?? null),
    dispose() { active = false; version++; state = { ...state, pending: false }; },
  };
}


export type PointsRange = 7 | 30 | 90 | 'all';
export function availablePointsStart(rows: DailyPoints[]): string | null {
  return rows.reduce<string | null>((first, row) => first === null || row.bridge_day < first ? row.bridge_day : first, null);
}
// The shared server Bridge day starts at UTC midnight.
export function currentPointsDay(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}
export function pointsRangeStart(range: PointsRange, end: string): string | null {
  if (range === 'all') return null;
  const date = new Date(end + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() - range + 1);
  return date.toISOString().slice(0, 10);
}
export function visiblePointDays(rows: DailyPoints[], range: PointsRange, end: string): DailyPoints[] {
  const start = pointsRangeStart(range, end);
  return rows.filter(row => row.bridge_day <= end && (start === null || row.bridge_day >= start));
}



