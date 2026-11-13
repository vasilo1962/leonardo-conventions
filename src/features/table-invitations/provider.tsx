import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { FriendAcceptance } from '@/features/friends/api';
import type { OpenTableSeat } from '@/bridge/types/table';
import { liveInvitation, type TableInvitationDashboard, type InvitationPreference } from './types';

export async function tableInvitationRpc<T>(name: string, args?: Record<string, unknown>): Promise<T> {
 const {data,error}=await supabase.rpc(name,args); if(error) throw error; return data as T;
}
type Value = {
 enabled: boolean; account: string | null; playing: boolean; deferred: boolean; tournament: boolean;
 data: TableInvitationDashboard | null; busy: boolean; failed: boolean; now: number;
 open: boolean; setOpen: (open: boolean) => void;
 presence: Record<string, boolean>;
 refresh: () => Promise<void>;
 send: (other: string, table?: string, position?: OpenTableSeat['position']) => Promise<{created_table?: Extract<FriendAcceptance,{kind:'table'}>['table']} | undefined>;
 action: (id: string, action: string) => Promise<void>;
 preference: (value: InvitationPreference) => Promise<void>;
};
const Context=createContext<Value|null>(null);
export const useTableInvitations=()=>useContext(Context);

export default function TableInvitationsProvider({enabled,account,playing,deferred,tournament,beforeJoin,onAccepted,children}: {
 enabled: boolean; account: string|null; playing: boolean; deferred: boolean; tournament: boolean;
 beforeJoin: () => Promise<boolean>; onAccepted: (result: Extract<FriendAcceptance,{kind:'table'}>) => void; children: ReactNode;
}) {
 const active=enabled && !!account;
 const [data,setData]=useState<{account:string;value:TableInvitationDashboard}|null>(null);
 const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[open,setOpen]=useState(false);
 const [foreground,setForeground]=useState(true),[clock,setClock]=useState(Date.now);
 const [presence,setPresence]=useState<Record<string,boolean>>({});
 const current=useRef(account),operation=useRef(false),reload=useRef(false),reading=useRef<Promise<void>|null>(null);
 const offset=useRef(0),playingRef=useRef(playing);
 useLayoutEffect(()=>{current.current=account;playingRef.current=playing;},[account,playing]);
 useEffect(()=>()=>{current.current=null;},[]);
 useEffect(()=>{
  if(typeof document==='undefined') return;
  const update=()=>setForeground(document.visibilityState!=='hidden');
  update();document.addEventListener('visibilitychange',update);
  return ()=>document.removeEventListener('visibilitychange',update);
 },[]);
 const refresh=useCallback(async function load() {
  if(!active || !account || current.current!==account) return;
  if(reading.current){reload.current=true;return reading.current;}
  const request=tableInvitationRpc<TableInvitationDashboard>('table_invitation_dashboard').then(value=>{
   if(current.current!==account) return;
   offset.current=Date.parse(value.server_now)-Date.now();setData({account,value});setClock(Date.now());setFailed(false);
  }).catch(()=>{if(current.current===account)setFailed(true);}).finally(()=>{
   if(reading.current!==request)return;
   reading.current=null;
   if(reload.current && current.current===account){reload.current=false;void load();}
  });
  reading.current=request;return request;
 },[active,account]);
 useEffect(()=>{
  if(!active || !foreground || !account)return;
  let live=true;
  const channel=supabase.channel('table-invitations:'+account,{config:{private:true}})
   .on('broadcast',{event:'changed'},()=>{if(live)void refresh();})
   .subscribe(status=>{if(live && status==='SUBSCRIBED')void refresh();});
  return ()=>{live=false;void supabase.removeChannel(channel);};
 },[active,account,foreground,refresh]);
 const publisher=useRef<ReturnType<typeof supabase.channel>|null>(null);
 useEffect(()=>{
  if(!active || !foreground || !account)return;
  let live=true;
  const channel=supabase.channel('table-invitation-lobby',{config:{private:true,presence:{key:account}}});
  channel.on('presence',{event:'sync'},()=>{
   if(!live)return;
   const state=channel.presenceState<{playing?:boolean}>();
   setPresence(Object.fromEntries(Object.entries(state).map(([id,clients])=>[id,clients.some(v=>v.playing===true)])));
  }).subscribe(status=>{
   if(!live)return;
   if(status==='SUBSCRIBED')void channel.track({playing:playingRef.current});
   if(['CLOSED','CHANNEL_ERROR','TIMED_OUT'].includes(status))setPresence({});
  });
  publisher.current=channel;
  return ()=>{live=false;publisher.current=null;setPresence({});void channel.untrack();void supabase.removeChannel(channel);};
 },[active,foreground,account]);
 useEffect(()=>{if(publisher.current?.state==='joined')void publisher.current.track({playing});},[playing]);
 const shown=data?.account===account?data.value:null;
 const deadlines=JSON.stringify(shown?.invitations.flatMap(i=>[i.expires_at,i.ready_at]).filter(Boolean)??[]);
 useEffect(()=>{
  const future=(JSON.parse(deadlines) as string[]).map(Date.parse).filter(v=>v>Date.now()+offset.current);
  if(!future.length)return;
  const timer=setTimeout(()=>setClock(Date.now()),Math.min(...future)-Date.now()-offset.current+1);
  return ()=>clearTimeout(timer);
 },[deadlines,clock]);
 async function mutate<T>(name:string,args:Record<string,unknown>):Promise<T|undefined>{
  if(!active || !account || operation.current)return;
  const owner=account;operation.current=true;setBusy(true);setFailed(false);
  try{
   const result=await tableInvitationRpc<T>(name,args);
   if(current.current!==owner)return;
   await refresh();return result;
  }catch(error){if(current.current===owner)setFailed(true);throw error;}
  finally{operation.current=false;if(current.current===owner)setBusy(false);}
 }
 const now=clock+offset.current;
 const value:Value={
  enabled:active,account,playing,deferred,tournament,data:shown?{...shown,invitations:shown.invitations.map(i=>({...i,ready:i.ready||i.status==='waiting'&&!!i.ready_at&&Date.parse(i.ready_at)<=now}))}:null,busy,failed,now,open,setOpen,presence,refresh,
  send:(other,table,position)=>mutate('table_send_invitation',{p_other:other,p_table_id:table??null,p_position:position??'North'}),
  preference:async p_value=>{await mutate('table_invitation_preference',{p_value});},
  action:async(id,action)=>{
   if(operation.current || !account)return;
   const invitation=shown?.invitations.find(i=>i.id===id);
   if(action==='accept'){
    if(!invitation || !liveInvitation(invitation,Date.now()+offset.current) || deferred)return;
    const owner=account;
    operation.current=true;setBusy(true);setFailed(false);
    try{
     setOpen(false);
     if(playing && !await beforeJoin())return;
     if(current.current!==owner)return;
     const result=await tableInvitationRpc<Extract<FriendAcceptance,{kind:'table'}>>('table_invitation_action',{p_id:id,p_action:action});
     if(current.current===owner){await refresh();onAccepted(result);}
    }catch(error){if(current.current===owner){setFailed(true);setOpen(true);}throw error;}
    finally{operation.current=false;if(current.current===owner)setBusy(false);}
    return;
   }
   await mutate('table_invitation_action',{p_id:id,p_action:action});
  },
 };
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
