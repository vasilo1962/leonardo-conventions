import {tableTextSpeech} from './table-speech.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=html=>html.replace(/<[^>]*>/g,'');
// A single spoken text node for the complete prose run, not one node per bid.
// Existing links retain their exact markup and remain outside aria-hidden content.
export function accessibleProseParagraphs(html,language){
 return html.split(/(<table\b[^>]*>[\s\S]*?<\/table>)/gi).map((section,index)=>index%2?section:section.replace(/<p>([\s\S]*?)<\/p>/g,(original,body)=>{
  let changed=false;
  const content=body.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi).map((run,part)=>{
   if(part%2||!/[♣♦♥♠]/.test(text(run)))return run;
   changed=true;
   const source=text(run);
   const speech=(/^\s/.test(source)?' ':'')+tableTextSpeech(source,language)+(/\s$/.test(source)?' ':'');
   return '<span aria-hidden="true">'+run+'</span><span class="paragraph-speech sr-only">'+escape(speech)+'</span>';
  }).join('');
  return changed?'<p class="spoken-paragraph">'+content+'</p>':original;
 })).join('');
}
