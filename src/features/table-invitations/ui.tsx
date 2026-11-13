import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import AppOverlay from '@/components/app-overlay';
import PopupLanguageControl from '@/components/popup-language-control';
import { usePopupLanguage } from '@/hooks/use-popup-language';
import usePlayerLanguage from '@/hooks/use-player-language';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';
import useInfoMessageReading from '@/shared/accessibility/use-info-message-reading';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import { useActivityPopups, useActivityPopupBlocker } from '@/shared/notifications/activity-popup-provider';
import { getFriendCopy } from '@/features/friends/copy';
import { getSystemPopupCopy } from '@/lib/system-popup-translations';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import type { OpenTableSeat } from '@/bridge/types/table';
import * as light from '@/lib/light-popup-style';
import { liveInvitation, type AvailableTablePlayer, type TableInvitation, type InvitationPreference } from './types';
import { useTableInvitations, tableInvitationRpc } from './provider';
import { getTableInvitationCopy } from './copy';
import { shareTableInvitation, type InvitationShareService } from './share';

function useMetrics(){
 const {width,height}=useWindowDimensions(),mobile=width<768;
 const font=responsiveHeightFontSize(height*light.LIGHT_POPUP_MESSAGE_FONT_RATIO,width,height,mobile);
 const buttonFont=responsiveHeightFontSize(height*light.LIGHT_POPUP_BUTTON_FONT_RATIO,width,height,mobile);
 return {width,height,mobile,font,buttonFont};
}
function InvitationAction({label,language,onPress,disabled=false}:{label:string;language:InfoLanguage;onPress:()=>void;disabled?:boolean}){
 const {height,buttonFont:font}=useMetrics();const [size,setSize]=useState(0);
 return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityLanguage={language}
 {...{lang:language}} disabled={disabled} accessibilityState={{disabled}}
 onHoverIn={event=>focusHoveredMenuControl(event,language)} onPress={onPress}
 onLayout={event=>setSize(event.nativeEvent.layout.height)}
 style={({pressed})=>({alignSelf:'stretch',alignItems:'center',paddingHorizontal:font*1.5,paddingVertical:font*0.35,
 borderWidth:height*light.LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
 borderColor:light.LIGHT_POPUP_PRIMARY_BUTTON_BORDER_COLOR,backgroundColor:light.LIGHT_POPUP_PRIMARY_BUTTON_BACKGROUND_COLOR,
 borderRadius:light.getLightPopupButtonRadius(size),opacity:disabled?0.55:pressed?0.8:1})}>
 <Text aria-hidden style={{fontSize:font,lineHeight:font*light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO,
 fontWeight:'900',textAlign:'center',color:light.LIGHT_POPUP_BUTTON_COLOR}}>{label}</Text></Pressable>;
}
function InvitationFrame({children,onClose,language,playerLanguage,showEnglish,toggleLanguage,bounds}:{
 children:ReactNode;onClose:()=>void;language:InfoLanguage;playerLanguage:InfoLanguage;showEnglish:boolean;toggleLanguage:()=>void;
 bounds?:{left:number;top:number;width:number;height:number};
}){
 const {width,height,mobile,font}=useMetrics();const [size,setSize]=useState(0);
 return <AppOverlay visible transparent animationType="fade" announceContent={false} readPrimaryAction={false} onRequestClose={onClose}>
 <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.60)'}}>
 <View style={{position:'absolute',...(bounds??{left:0,top:0,width,height}),alignItems:'center',justifyContent:'center'}}>
 <View testID="table-invitation-frame" accessibilityViewIsModal accessibilityLanguage={language} {...{lang:language}}
 onLayout={event=>setSize(event.nativeEvent.layout.height)}
 style={{maxWidth:mobile?width*light.LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO
 :bounds?bounds.width*light.LIGHT_POPUP_SMALL_TABLE_AREA_MAX_WIDTH_RATIO:width*light.LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO,
 maxHeight:'90%',padding:font*light.LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
 backgroundColor:light.LIGHT_POPUP_FRAME_BACKGROUND_COLOR,borderColor:light.LIGHT_POPUP_FRAME_BORDER_COLOR,
 borderWidth:height*light.LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO,borderRadius:light.getLightPopupFrameRadius(size,height)}}>
 <View style={{flexShrink:1}}>
 <PopupLanguageControl variant="light" {...{playerLanguage,showEnglish}} onPress={toggleLanguage} onClose={onClose}/>
 <ScrollView style={{flexGrow:0,flexShrink:1}} keyboardShouldPersistTaps="handled">{children}</ScrollView>
 </View></View></View></View></AppOverlay>;
}
function InvitationText({children,language,bold=false}:{children:string;language:InfoLanguage;bold?:boolean}){
 const {font}=useMetrics();
 return <Text accessibilityLanguage={language} {...{lang:language,tabIndex:-1 as const}}
 {...{onPointerEnter:(event:{currentTarget:unknown})=>focusHoveredMenuControl(event,language)}}
 style={{fontSize:font,lineHeight:font*light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO,color:light.LIGHT_POPUP_MESSAGE_COLOR,
 fontWeight:bold?'700':'400',textAlign:language==='ar'||language==='he'?'right':'left'}}>{children}</Text>;
}
export function TableInvitationPicker({tableId,position,link,onClose,bounds}:{
 tableId:string;position:OpenTableSeat['position'];link:string;onClose:()=>void;
 bounds?:{left:number;top:number;width:number;height:number};
}){
 const context=useTableInvitations()!;const languages=usePopupLanguage(true);
 const {font}=useMetrics(),copy=getTableInvitationCopy(languages.language),friends=getFriendCopy(languages.language);
 const [players,setPlayers]=useState<AvailableTablePlayer[]|null>(null),[failed,setFailed]=useState(false),[sent,setSent]=useState<string[]>([]);
 const [shareFailed,setShareFailed]=useState(false),[revision,setRevision]=useState(0);
 const ids=JSON.stringify(Object.keys(context.presence).filter(id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)).sort());
 const presence=context.presence;
 useEffect(()=>{
  let active=true;
  const list=JSON.parse(ids) as string[];
  void tableInvitationRpc<Omit<AvailableTablePlayer,'playing'>[]>('table_invitation_players',{p_ids:list}).then(rows=>{
   if(active){setFailed(false);setPlayers(rows.map(p=>({...p,playing:false})));}
  }).catch(()=>{if(active)setFailed(true);});
  return ()=>{active=false;};
 },[ids,revision]);
 async function invite(id:string){
  try{const result=await context.send(id,tableId,position);if(result)setSent(previous=>[...previous,id]);}
  catch{setFailed(true);}
 }
 async function share(service:InvitationShareService){
  setShareFailed(false);const result=await shareTableInvitation(service,link,friends.tableNotice);
  if(result==='unavailable')setShareFailed(true);
 }
 return <InvitationFrame {...languages} {...{onClose,bounds}}>
 <View style={{gap:font*0.7}}>
 <InvitationText language={languages.language} bold>{copy.players}</InvitationText>
 {players===null&&!failed?<ActivityIndicator color={light.LIGHT_POPUP_MESSAGE_COLOR}/>:null}
 {players?.length===0?<InvitationText language={languages.language}>{copy.noPlayers}</InvitationText>:null}
 {[true,false].map(friend=>{
  const group=players?.filter(p=>p.friend===friend&&Object.hasOwn(presence,p.user_id))??[];
  return group.length?<View key={String(friend)} style={{gap:font*0.35}}>
  <InvitationText language={languages.language} bold>{friend?friends.title:copy.others}</InvitationText>
  {group.map(p=><View key={p.user_id} style={{gap:font*0.35}}>
  <InvitationText language={languages.language}>{p.username+(presence[p.user_id]?' · '+copy.playing:'')}</InvitationText>
  <InvitationAction language={languages.language} label={sent.includes(p.user_id)?copy.sent:copy.invite}
  disabled={context.busy||sent.includes(p.user_id)} onPress={()=>{void invite(p.user_id);}}/>
  </View>)}</View>:null;
 })}
 {failed||context.failed?<><InvitationText language={languages.language}>{friends.failed}</InvitationText>
 <InvitationAction label={friends.retry} language={languages.language} onPress={()=>{setRevision(v=>v+1);}}/></>:null}
 <InvitationText language={languages.language} bold>{copy.share}</InvitationText>
 {(['Viber','WhatsApp','Messenger','Email'] as const).map(service=><InvitationAction key={service}
 language={languages.language} label={service} onPress={()=>{void share(service);}}/>)}
 <InvitationAction language={languages.language} label={copy.share} onPress={()=>{void share('system');}}/>
 {shareFailed?<InvitationText language={languages.language}>{copy.shareUnavailable}</InvitationText>:null}
 </View></InvitationFrame>;
}

export function TableInvitationPreference(){
 const context=useTableInvitations(),{language}=usePlayerLanguage(),{font}=useMetrics();
 if(!context?.enabled)return null;
 const copy=getTableInvitationCopy(language),friends=getFriendCopy(language);
 return <View testID="table-invitation-preference" style={{gap:font*0.35}}>
 <InvitationText language={language}>{copy.preference}</InvitationText>
 {!context.data?<InvitationText language={language}>{friends.loading}</InvitationText>
 :(['all','friends','none'] as InvitationPreference[]).map(value=><Pressable key={value} accessibilityRole="radio"
 accessibilityLanguage={language} accessibilityLabel={copy[value==='friends'?'friendsOnly':value]}
 accessibilityState={{checked:context.data?.preference===value,disabled:context.busy}}
 aria-checked={context.data?.preference===value} disabled={context.busy}
 onHoverIn={event=>focusHoveredMenuControl(event,language)}
 onPress={()=>{void context.preference(value).catch(()=>undefined);}}>
 <InvitationText language={language}>{(context.data?.preference===value?'◉ ':'○ ')+copy[value==='friends'?'friendsOnly':value]}</InvitationText>
 </Pressable>)}
 {context.failed?<InvitationText language={language}>{friends.failed}</InvitationText>:null}
 </View>;
}
export function TableInvitationHeader({fontSize,height}:{fontSize:number;height:number}){
 const context=useTableInvitations(),{language}=usePlayerLanguage();
 const items=context?.data?.invitations.filter(i=>liveInvitation(i,context.now)||!i.seen)??[];
 if(!context?.enabled||!items.length)return null;
 const label=getTableInvitationCopy(language).pending;
 return <Pressable testID="table-invitation-header" accessibilityRole="button" accessibilityLabel={label}
 accessibilityLanguage={language} {...{title:label}} onHoverIn={event=>focusHoveredMenuControl(event,language)}
 onPress={()=>context.setOpen(!context.open)} style={{height,justifyContent:'center',marginRight:fontSize*0.35}}>
 <Text aria-hidden style={{fontSize,lineHeight:height,color:light.LIGHT_POPUP_TITLE_COLOR}}>⏳</Text>
 </Pressable>;
}
function invitationMessage(i:TableInvitation,language:InfoLanguage){
 const copy=getTableInvitationCopy(language);
 const status=i.status==='cancelled'?copy.cancelled:i.status==='declined'?copy.declined
 :i.status==='accepted'?copy.accepted:i.status==='wait_requested'?copy.waitReply
 :i.status==='waiting'?(i.ready?copy.ready:copy.waiting):getFriendCopy(language).tableNotice;
 return [i.incoming?i.sender_name:i.recipient_name,i.table_name,status].join('\n');
}
export function TableInvitationNotifications(){
 const context=useTableInvitations();
 const [dismissed,setDismissed]=useState<string[]>([]);
 const items=context?.data?.invitations.filter(i=>liveInvitation(i,context.now)||!i.seen)??[];
 const notice=items.find(i=>!i.seen&&!dismissed.includes(i.id+':'+i.status+':'+i.ready)
 &&(i.status!=='waiting'||i.ready)&&
 (i.incoming||i.status==='wait_requested'&&i.host_id===context?.account||['cancelled','declined','accepted'].includes(i.status)));
 const queued=useActivityPopups(context?.enabled&&!context.busy&&!context.deferred&&!context.open&&notice
 ?[{key:'table-invitation:'+notice.id+':'+notice.status+':'+notice.ready,kind:'friends'}]:[]);
 useActivityPopupBlocker(Boolean(context?.open));
 const visible=Boolean(context?.enabled&&!context.busy&&(context.open||queued==='friends'));
 const languages=usePopupLanguage(visible),copy=getTableInvitationCopy(languages.language),friends=getFriendCopy(languages.language);
 const {font}=useMetrics(),messageRef=useRef<Text>(null),voice=useVoiceMode();
 const presented=context?.open?items:notice?[notice]:[];
 const message=presented.map(i=>invitationMessage(i,languages.language)).join('\n');
 useInfoMessageReading(messageRef,visible,voice.enabled,message,languages.language);
 if(!visible||!context)return null;
 const close=()=>{
  if(context.busy)return;
  context.setOpen(false);
  if(notice){setDismissed(ids=>[...ids,notice.id+':'+notice.status+':'+notice.ready]);void context.action(notice.id,'seen').catch(()=>undefined);}
 };
 const action=(i:TableInvitation,key:string,label:string)=><InvitationAction key={key} label={label} language={languages.language}
 disabled={context.busy||context.deferred&&key==='accept'} onPress={()=>{void context.action(i.id,key).catch(()=>undefined);}}/>;
 return <InvitationFrame {...languages} onClose={close}>
 <View style={{gap:font*0.7}}>
 <Text ref={messageRef} accessibilityLanguage={languages.language} {...{lang:languages.language,tabIndex:-1 as const}}
 style={{fontSize:font,lineHeight:font*light.LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO,color:light.LIGHT_POPUP_MESSAGE_COLOR}}>{message}</Text>
 {presented.map(i=><View key={i.id} style={{gap:font*0.35}}>
 {i.incoming&&i.status==='pending'?<>
 {action(i,'accept',friends.accept)}{context.tournament?action(i,'wait',copy.waitReply):null}{action(i,'decline',copy.notNow)}
 </>:i.status==='wait_requested'?i.host_id===context.account?<>
 <InvitationText language={languages.language}>{copy.hostQuestion}</InvitationText>
 {action(i,'approve_wait',copy.waitYes)}{action(i,'cancel',copy.waitNo)}
 </>:i.incoming?action(i,'decline',copy.notComing):i.host_id===context.account?action(i,'cancel',copy.cancelWait):null
 :i.status==='waiting'?<>
 {i.incoming&&i.ready?action(i,'accept',friends.accept):null}
 {i.incoming?action(i,'decline',copy.notComing):action(i,'cancel',copy.cancelWait)}
 </>:!i.incoming&&i.status==='pending'?action(i,'cancel',friends.cancel):null}
 </View>)}
 {context.failed?<InvitationText language={languages.language}>{friends.failed}</InvitationText>:null}
 <InvitationAction label={getSystemPopupCopy(languages.language).close} language={languages.language} disabled={context.busy} onPress={close}/>
 </View></InvitationFrame>;
}
