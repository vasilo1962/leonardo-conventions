import { supabase } from '@/lib/supabase';
import type { OpenTableDeal, OpenTableSeat, OpenTableInvitation, TeachingTableLive, PartnershipTableLive } from '@/bridge/types/table';

export type FriendPerson = { user_id: string; username: string };
export type FriendRelation = FriendPerson & { id: string; status: 'pending' | 'accepted'; incoming: boolean; seen: boolean; acceptance_seen?: boolean; room: string | null };
export type FriendInvitation = { id: string; username: string; kind: 'duel' | 'table'; seen: boolean; expires_at: string | null; settings?: { deal_count: number; game_type: string } | null; table_name?: string | null };
export type FriendTable = { id: string; name: string; positions: string[] | null };
export type FriendsDashboard = { room: string; people: FriendRelation[]; invitations: FriendInvitation[]; tables: FriendTable[] };
export type FriendNotice = { id: string; username: string; kind: 'request' | 'friend-accepted' | 'duel' | 'table' };
export type FriendAcceptance = { kind: 'duel'; duel_id: string; username: string } | {
  kind: 'table'; table: { table_id: string; name: string; owner_id: string; status: 'open' | 'closed';
    seats: OpenTableSeat[]; invitations?: OpenTableInvitation[]; deal?: OpenTableDeal | null;
    teaching?: TeachingTableLive | null; partnership?: PartnershipTableLive | null };
};

export async function friendsRpc<T>(name: string, args?: Record<string, unknown>, expectedAccount?: string): Promise<T> {
  if (name === 'friends_change' && ['request', 'accept'].includes(String(args?.p_action))) {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) throw error ?? new Error('Authentication required');
    if (expectedAccount && data.session.user.id !== expectedAccount) throw new Error('Account changed');
    const response = await fetch('/api/friends/change', {
      method: 'POST', headers: { Authorization: 'Bearer ' + data.session.access_token,
        'Content-Type': 'application/json' },
      body: JSON.stringify(args), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Friend action unavailable');
    return undefined as T;
  }
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw error;
  return data as T;
}
export function nextFriendNotice(data: FriendsDashboard | null, now: number, includeRequests = true): FriendNotice | null {
  const request = includeRequests && data?.people.find(p => p.status === 'pending' && p.incoming && !p.seen);
  if (request) return { id: request.id, username: request.username, kind: 'request' };
  const accepted = includeRequests && data?.people.find(p => p.status === 'accepted' && !p.incoming && p.acceptance_seen === false);
  if (accepted) return { id: accepted.id, username: accepted.username, kind: 'friend-accepted' };
  const invitation = data?.invitations.find(i => !i.seen && (!i.expires_at || Date.parse(i.expires_at) > now));
  return invitation ? { id: invitation.id, username: invitation.username, kind: invitation.kind } : null;
}
export function presenceStatus(state: Record<string, { playing?: boolean }[]>): 'online' | 'playing' | 'offline' {
  const clients = Object.values(state).flat();
  return clients.some(c => c.playing === true) ? 'playing' : clients.length ? 'online' : 'offline';
}

