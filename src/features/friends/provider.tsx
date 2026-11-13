import { useTableInvitations } from '@/features/table-invitations/provider';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { friendsRpc, nextFriendNotice, presenceStatus, type FriendsDashboard, type FriendAcceptance, type FriendNotice } from './api';

type FriendsContextValue = {
  enabled: boolean; open: boolean; setOpen: (value: boolean) => void; playing: boolean;
  data: FriendsDashboard | null; busy: boolean; failed: boolean;
  statuses: Record<string, 'online' | 'playing' | 'offline'>; notice: FriendNotice | null;
  refresh: () => Promise<void>; change: (id: string, action: string) => Promise<void>;
  send: (args: Record<string, unknown>) => Promise<void>;
  respond: (id: string, accept: boolean) => Promise<void>; dismiss: (notice: FriendNotice) => Promise<void>;
};
const Context = createContext<FriendsContextValue | null>(null);
export const useFriends = () => useContext(Context);

export default function FriendsProvider({ accountId, playing, onAccepted, children }: {
  accountId: string | null; playing: boolean; onAccepted: (result: FriendAcceptance) => void; children: ReactNode;
}) {
  const tableInvitations = useTableInvitations();
  const [open, setOpen] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [state, setState] = useState<{ account: string; data: FriendsDashboard } | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [presence, setPresence] = useState<{ account: string; key: string; value: FriendsContextValue['statuses'] } | null>(null);
  const account = accountId;
  const current = useRef(account);
  const operation = useRef<object | null>(null);
  const reads = useRef<{ account: string; promise: Promise<void> } | null>(null);
  const reloadAfterRead = useRef(false);
  const [scope, setScope] = useState(account);
  if (scope !== account) { setScope(account); setBusy(false); setFailed(false); setOpen(false); }
  useLayoutEffect(() => { current.current = account; operation.current = null; }, [account]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const visible = () => { setForeground(document.visibilityState !== 'hidden'); setPresence(null); };
    const initial = setTimeout(() => { visible(); }, 0);
    document.addEventListener('visibilitychange', visible);
    return () => { clearTimeout(initial); document.removeEventListener('visibilitychange', visible); };
  }, []);
  const refresh = useCallback(async function loadDashboard() {
    if (!account || current.current !== account) return;
    if (reads.current?.account === account) { reloadAfterRead.current = true; return reads.current.promise; }
    const read = { account, promise: Promise.resolve() };
    read.promise = friendsRpc<FriendsDashboard>('friends_dashboard').then(data => {
      if (current.current === account) { setState({ account, data }); setFailed(false); }
    }).catch(() => { if (current.current === account) setFailed(true); }).finally(() => {
      if (reads.current !== read) return;
      reads.current = null;
      if (reloadAfterRead.current && current.current === account) {
        reloadAfterRead.current = false; void loadDashboard();
      }
    });
    reads.current = read;
    return read.promise;
  }, [account]);
  useEffect(() => {
    if (!account || !foreground) return;
    let active = true;
    const channel = supabase.channel(`friends:${account}`, { config: { private: true } })
      .on('broadcast', { event: 'changed' }, () => { if (active) void refresh(); })
      .subscribe(status => { if (active && status === 'SUBSCRIBED') void refresh(); });
    return () => { active = false; void supabase.removeChannel(channel); };
  }, [account, foreground, refresh]);
  const [clock, setClock] = useState(() => Date.now());
  const rawData = state?.account === account ? state.data : null;
  const deadlines = JSON.stringify(rawData?.invitations.map(i => i.expires_at).filter(Boolean) ?? []);
  useEffect(() => {
    const future = (JSON.parse(deadlines) as string[]).map(Date.parse).filter(time => time > Date.now());
    if (!future.length) return;
    const timer = setTimeout(() => setClock(Date.now()), Math.min(...future) - Date.now() + 1);
    return () => clearTimeout(timer);
  }, [deadlines, clock]);
  const data = rawData ? { ...rawData, invitations: rawData.invitations.filter(i => !i.expires_at || Date.parse(i.expires_at) > clock) } : null;
  const room = data?.room;
  const ownPresence = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const playingNow = useRef(playing);
  useLayoutEffect(() => { playingNow.current = playing; }, [playing]);
  useEffect(() => {
    if (!account || !room || !foreground) return;
    let active = true;
    const channel = supabase.channel(`friend-presence:${room}`, { config: { private: true } })
      .subscribe(status => { if (active && current.current === account && status === 'SUBSCRIBED') void channel.track({ playing: playingNow.current }); });
    ownPresence.current = channel;
    return () => {
      active = false; if (ownPresence.current === channel) ownPresence.current = null;
      void channel.untrack(); void supabase.removeChannel(channel);
    };
  }, [account, room, foreground]);
  useEffect(() => {
    const channel = ownPresence.current;
    if (channel?.state === 'joined') void channel.track({ playing });
  }, [playing]);
  const rooms = JSON.stringify(data?.people.filter(p => p.status === 'accepted' && p.room).map(p => [p.user_id, p.room]) ?? []);
  const observationKey = JSON.stringify([account, open, foreground, rooms]);
  const [observed, setObserved] = useState(observationKey);
  if (observed !== observationKey) { setObserved(observationKey); setPresence(null); }
  useEffect(() => {
    if (!account || !open || !foreground) return;
    const active = { value: true };
    const statuses: FriendsContextValue['statuses'] = {};
    const channels = (JSON.parse(rooms) as [string, string][]).map(([id, friendRoom]) => {
      const channel = supabase.channel(`friend-presence:${friendRoom}`, { config: { private: true } });
      const update = () => {
        if (!active.value) return;
        statuses[id] = presenceStatus(channel.presenceState<{ playing?: boolean }>());
        setPresence({ account, key: observationKey, value: { ...statuses } });
      };
      channel.on('presence', { event: 'sync' }, update).subscribe(status => {
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (active.value) { delete statuses[id]; setPresence({ account, key: observationKey, value: { ...statuses } }); }
        }
      });
      return channel;
    });
    return () => { active.value = false; channels.forEach(channel => { void supabase.removeChannel(channel); }); };
  }, [account, open, foreground, rooms, observationKey]);
  async function mutate<T>(name: string, args: Record<string, unknown>): Promise<T | undefined> {
    if (!account || current.current !== account || operation.current) return;
    const token = {}; operation.current = token; setBusy(true); setFailed(false);
    try {
      const result = await friendsRpc<T>(name, args, account);
      if (current.current !== account) return;
      await refresh(); return result;
    } catch (error) { if (current.current === account) setFailed(true); throw error; }
    finally { if (operation.current === token) { operation.current = null; setBusy(false); } }
  }
  const value: FriendsContextValue = {
    enabled: Boolean(account), open, setOpen, playing, data, busy, failed,
    statuses: presence?.account === account && presence.key === observationKey && foreground && open ? presence.value : {}, notice: nextFriendNotice(data, clock, !playing), refresh,
    change: async (id, action) => { await mutate('friends_change', { p_other: id, p_action: action }); },
    send: async args => {
      if (tableInvitations?.enabled && args.p_kind === 'table') {
        const result = await tableInvitations.send(String(args.p_other), args.p_table_id ? String(args.p_table_id) : undefined,
          args.p_position as 'North' | 'East' | 'South' | 'West' | undefined);
        if (result?.created_table && current.current === account) {
          setOpen(false); onAccepted({ kind: 'table', table: result.created_table });
        }
        return;
      }
      const result = await mutate<{ created_table?: Extract<FriendAcceptance, { kind: 'table' }>['table'] }>('friends_send_invitation', args);
      if (result?.created_table && current.current === account) { setOpen(false); onAccepted({ kind: 'table', table: result.created_table }); }
    },
    respond: async (id, accept) => {
      if (accept && playing) return;
      const result = await mutate<FriendAcceptance>('friends_respond_invitation', { p_id: id, p_accept: accept });
      if (accept && result && current.current === account) { setOpen(false); onAccepted(result); }
    },
    dismiss: async notice => {
      if (!account) return;
      if (notice.kind === 'friend-accepted') {
        if (operation.current || current.current !== account) return;
        await mutate('friends_dismiss_notice', { p_id: notice.id, p_kind: notice.kind });
        setState(previous => previous?.account === account && current.current === account ? { account, data: {
          ...previous.data,
          people: previous.data.people.map(p => p.id === notice.id ? { ...p, acceptance_seen: true } : p),
        } } : previous);
        return;
      }
      setState(previous => previous?.account === account ? { account, data: {
        ...previous.data,
        people: previous.data.people.map(p => p.id === notice.id ? { ...p, seen: true } : p),
        invitations: previous.data.invitations.map(i => i.id === notice.id ? { ...i, seen: true } : i),
      } } : previous);
      await friendsRpc('friends_dismiss_notice', { p_id: notice.id, p_kind: notice.kind });
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

