import {cardLengthSpeech} from './card-length-speech.mjs';
import {tableTextSpeech} from './table-speech.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=html=>html.replace(/<[^>]*>/g,'');
// A single spoken text node for the complete prose run, not one node per bid.
// Existing links retain their exact markup and remain outside aria-hidden content.
export function accessibleProseParagraphs(html,language){
 return html.split(/(<table\b[^>]*>[\s\S]*?<\/table>)/gi).map((section,index)=>index%2?section:section.replace(/<p>([\s\S]*?)<\/p>/g,(original,body)=>{
  let changed=false;
  const content=body.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi).map((run,part)=>{
   if(part%2||(!/[♣♦♥♠]/.test(text(run))&&cardLengthSpeech(text(run),language)===text(run)))return run;
   changed=true;
   const source=text(run);
   const speech=(/^\s/.test(source)?' ':'')+(/[♣♦♥♠]/.test(source)?tableTextSpeech(source,language):cardLengthSpeech(source,language))+(/\s$/.test(source)?' ':'');
   return '<span aria-hidden="true">'+run+'</span><span class="paragraph-speech sr-only">'+escape(speech)+'</span>';
  }).join('');
  return changed?'<p class="spoken-paragraph">'+content+'</p>':original;
 })).join('').replace(/<(li|h[1-6])>([\s\S]*?)<\/\1>/g,(original,tag,body)=>{
  if(cardLengthSpeech(text(body),language)===text(body))return original;
  if(tag!=='li')return '<'+tag+' aria-label="'+escape(cardLengthSpeech(text(body),language))+'">'+body+'</'+tag+'>';
  const content=body.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi).map((run,part)=>{
   if(part%2||cardLengthSpeech(text(run),language)===text(run))return run;
   return '<span aria-hidden="true">'+run+'</span><span class="length-speech sr-only">'+escape(cardLengthSpeech(text(run),language))+'</span>';
  }).join('');
  return '<li class="spoken-paragraph">'+content+'</li>';
 });
}
