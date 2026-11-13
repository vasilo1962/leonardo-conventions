export type InvitationShareService='Viber'|'WhatsApp'|'Messenger'|'Email'|'system';
export async function shareTableInvitation(service:InvitationShareService,url:string,text:string):Promise<'opened'|'cancelled'|'unavailable'>{
 if(typeof window==='undefined')return 'unavailable';
 if(service==='system'||service==='Messenger'){
  if(typeof navigator.share!=='function')return 'unavailable';
  try{await navigator.share({title:'Leonardo Bridge',text,url});return 'opened';}
  catch(error){if(error instanceof Error && error.name==='AbortError')return 'cancelled';return 'unavailable';}
 }
 const body=text+'\n'+url;
 const target=service==='WhatsApp'?'https://wa.me/?text='+encodeURIComponent(body)
 :service==='Viber'?'viber://forward?text='+encodeURIComponent(body)
 :'mailto:?subject='+encodeURIComponent('Leonardo Bridge')+'&body='+encodeURIComponent(body);
 window.open(target,'_blank','noopener,noreferrer');return 'opened';
}
