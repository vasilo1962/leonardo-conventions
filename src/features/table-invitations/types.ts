import type { OpenTableSeat } from '@/bridge/types/table';
export type InvitationPreference = 'all' | 'friends' | 'none';
export type TableInvitation = {
 id: string; table_id: string; position: OpenTableSeat['position'];
 sender_id: string; recipient_id: string; host_id: string;
 sender_name: string; recipient_name: string; table_name: string;
 status: 'pending' | 'wait_requested' | 'waiting' | 'accepted' | 'declined' | 'cancelled';
 expires_at: string | null; ready_at: string | null; incoming: boolean; seen: boolean; ready: boolean;
};
export type TableInvitationDashboard = {
 server_now: string; preference: InvitationPreference; invitations: TableInvitation[];
};
export type AvailableTablePlayer = { user_id: string; username: string; friend: boolean; playing: boolean };
export function liveInvitation(i: TableInvitation, now: number) {
 return ['pending','wait_requested','waiting'].includes(i.status) && (!i.expires_at || Date.parse(i.expires_at)>now);
}
