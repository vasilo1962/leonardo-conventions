// Standalone adaptation of bridge365 VOICEOVER_GUIDE.md. No account or game storage access.
const key='leonardo:conventions:accessibility:v1';
const sessionKey=key+':intro';
const source=document.querySelector('#voice-copy');
if(source){
 const copy=JSON.parse(source.textContent);
 const toggle=document.querySelector('.voice-toggle');
 const settings=document.querySelector('.voice-settings');
 const reader=document.querySelector('#voice-reader');
 const dialog=document.querySelector('.voice-intro');
 const message=document.querySelector('#voice-intro-message');
 const live=document.querySelector('#voice-live');
 const caption=document.querySelector('#voice-caption');
 let state={enabled:false,screenReader:false};let introShown=false;let beforeDialog=null;let liveTimer;
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved.enabled==='boolean'&&typeof saved.screenReader==='boolean')state={enabled:saved.enabled||saved.screenReader,screenReader:saved.screenReader};}catch{/* Readable defaults and in-memory preferences remain available. */}
 try{introShown=sessionStorage.getItem(sessionKey)==='true';}catch{}
 const markIntro=()=>{introShown=true;try{sessionStorage.setItem(sessionKey,'true');}catch{}};
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
 const clearSpeech=()=>{clearTimeout(liveTimer);live.textContent='';};
 const showCaption=text=>{caption.textContent=text;caption.hidden=!state.enabled||!text;};
 const hint=()=>{clearSpeech();liveTimer=setTimeout(()=>{if(!state.enabled&&!dialog.open)live.textContent=copy.hint;},40);};
 const update=()=>{document.documentElement.dataset.voiceMode=String(state.enabled);document.body.classList.toggle('voice-enabled',state.enabled);toggle.hidden=state.screenReader;toggle.setAttribute('aria-checked',String(state.enabled));toggle.querySelector('span').textContent=state.enabled?'🔊':'🔇';reader.checked=state.screenReader;caption.hidden=!state.enabled||!caption.textContent;};
 function maybeIntro(){
  if(!state.enabled||state.screenReader||introShown)return;
  clearSpeech();markIntro();settings.open=false;beforeDialog=document.activeElement;dialog.showModal();
  // Native dialog chooses this single autofocus reading target. No simultaneous live message.
  if(document.activeElement!==message)message.focus({preventScroll:true});
 }
 toggle.hidden=false;settings.hidden=false;update();
 toggle.addEventListener('click',()=>{if(state.screenReader)return;state.enabled=!state.enabled;clearSpeech();persist();update();if(state.enabled)maybeIntro();});
 reader.addEventListener('change',()=>{state.screenReader=reader.checked;if(state.screenReader){state.enabled=true;markIntro();}clearSpeech();persist();update();});
 dialog.querySelector('[data-voice-close]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-voice-disable]').addEventListener('click',()=>{state.enabled=false;state.screenReader=false;clearSpeech();persist();update();dialog.close();});
 dialog.addEventListener('close',()=>{if(beforeDialog?.isConnected&&!beforeDialog.hidden)beforeDialog.focus({preventScroll:true});});
 document.addEventListener('click',event=>{
  if(state.enabled||dialog.open||event.defaultPrevented||event.button!==0)return;
  const target=event.target instanceof Element?event.target:null;
  if(!target||target.closest('button,a,input,textarea,select,summary,label,[role="button"],[role="switch"],[role="checkbox"],[role="dialog"],dialog,[contenteditable]'))return;
  hint();
 });
 // Mouse exploration focuses the actual element, never clicks or emits a hover live message.
 const controls='a,button:not(:disabled),input,select,summary,[tabindex],main p,main h1,main h2,main h3,.hand-row,.exercise-auction th,.exercise-auction td';
 const editable=()=>document.activeElement?.matches('input,textarea,select,[contenteditable]');
 document.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch'||editable())return;
  const target=event.target instanceof Element?event.target.closest(controls):null;
  if(!target||target.closest('[hidden]')||(dialog.open&&!dialog.contains(target)))return;
  if(event.relatedTarget instanceof Node&&target.contains(event.relatedTarget))return;
  if(target.matches('.hand-row')){const text=target.querySelector('.sr-only')?.textContent;if(text)target.setAttribute('aria-label',text);}
  if(!target.matches('a,button,input,select,summary,[tabindex]'))target.tabIndex=-1;
  if(document.activeElement!==target)target.focus({preventScroll:true});
 });
 document.addEventListener('focusin',event=>{
  if(!state.enabled)return;
  const target=event.target;if(!(target instanceof HTMLElement)||target===live||target.matches('input,textarea,select'))return;
  showCaption(target.getAttribute('aria-label')||target.innerText||target.textContent||'');
 });
 for(const region of [live,document.querySelector('#exercise-announcement')].filter(Boolean))new MutationObserver(()=>{if(state.enabled&&region.textContent)showCaption(region.textContent);}).observe(region,{childList:true,subtree:true,characterData:true});
 const header=document.querySelector('.site-header');
 const measure=()=>document.documentElement.style.setProperty('--site-header-height',header.getBoundingClientRect().height+'px');
 new ResizeObserver(measure).observe(header);measure();
 if(state.screenReader)markIntro();
 maybeIntro();
 // An article/catalog has one initial reading target. Exercises own their question announcement.
 if(state.enabled&&!dialog.open&&!document.querySelector('#exercise-data')){
  const title=document.querySelector('main h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
 }
}
