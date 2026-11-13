import { supabase } from '@/lib/supabase';
import { leonardoPoints } from '@/features/statistics/points';

export const LEADERBOARD_PERIODS = ['daily', 'monthly', 'all-time'] as const;
export type LeaderboardPeriod = typeof LEADERBOARD_PERIODS[number];
export type LeonardoLeaderboardRow = {
  position: number; username: string; is_current_player: boolean; total_score: number;
};
export type LeonardoLeaderboard = {
  period: LeaderboardPeriod; bridge_day: string; period_start: string | null;
  leaderboard: LeonardoLeaderboardRow[]; current_player: LeonardoLeaderboardRow | null;
  player_count: number;
};

function validRow(row: LeonardoLeaderboardRow): boolean {
  return !!row && Number.isInteger(row.position) && row.position > 0
    && typeof row.username === 'string' && typeof row.is_current_player === 'boolean'
    && Number.isFinite(row.total_score) && Math.abs(row.total_score) <= Number.MAX_SAFE_INTEGER;
}

export async function loadLeonardoLeaderboard(period: LeaderboardPeriod): Promise<LeonardoLeaderboard> {
  const { data, error } = await supabase.rpc('get_leonardo_points_leaderboard', { p_period: period });
  if (error) throw error;
  const result = data as LeonardoLeaderboard;
  if (!result || result.period !== period || !/^\d{4}-\d{2}-\d{2}$/.test(result.bridge_day)
    || !Number.isInteger(result.player_count) || result.player_count < 0
    || !Array.isArray(result.leaderboard) || result.leaderboard.length !== result.player_count
    || result.leaderboard.some(row => !validRow(row))
    || (result.current_player !== null && !validRow(result.current_player))) {
    throw new Error('Invalid Leonardo leaderboard response');
  }
  const convert = (row: LeonardoLeaderboardRow) => ({ ...row, total_score: leonardoPoints(row.total_score) });
  return { ...result, leaderboard: result.leaderboard.map(convert),
    current_player: result.current_player ? convert(result.current_player) : null };
}

export type LeaderboardState = { data: LeonardoLeaderboard | null; pending: boolean; error: boolean };
export const emptyLeaderboard = (): LeaderboardState => ({ data: null, pending: false, error: false });

// Independent periods, stable content during retries, and no publication after disposal.
export function createLeaderboardLoader(read = loadLeonardoLeaderboard) {
  let state: Record<LeaderboardPeriod, LeaderboardState> = {
    daily: emptyLeaderboard(), monthly: emptyLeaderboard(), 'all-time': emptyLeaderboard(),
  };
  let active = true, generation = 0;
  const listeners = new Set<() => void>();
  const publish = (period: LeaderboardPeriod, value: LeaderboardState) => {
    state = { ...state, [period]: value }; listeners.forEach(listener => listener());
  };
  const load = async (period: LeaderboardPeriod) => {
    if (!active || state[period].pending) return;
    const token = generation;
    publish(period, { ...state[period], pending: true, error: false });
    try {
      const data = await read(period);
      if (active && token === generation) publish(period, { data, pending: false, error: false });
    } catch {
      if (active && token === generation) publish(period, { ...state[period], pending: false, error: true });
    }
  };
  return {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    activate() { active = true; },
    load,
    dispose() {
      active = false; generation++;
      for (const period of LEADERBOARD_PERIODS) state = { ...state, [period]: { ...state[period], pending: false } };
    },
  };
}

