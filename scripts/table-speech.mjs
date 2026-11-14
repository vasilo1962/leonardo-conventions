import {readFile} from 'node:fs/promises';
const copies=JSON.parse(await readFile('content/shared/bid-speech.json','utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=html=>html.replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
export function tableTextSpeech(html,language){
 const copy=copies[language];
 return plain(html).replace(/(?<![\p{L}\p{N}])([1-7])\s*(♣|♦|♥|♠|NT|ΝΤ|SA|ST|UT|BA|BT)(?![\p{L}\p{N}])/gu,(_,level,suit)=>copy.bids[level][['♣','♦','♥','♠'].includes(suit)?suit:'NT']).replace(/[♣♦♥♠]/g,suit=>copy.suits[['♣','♦','♥','♠'].indexOf(suit)]);
}
function spokenCell(html,language){
 return `<span aria-hidden="true">${html}</span><span class="table-cell-speech sr-only">${escape(tableTextSpeech(html,language))}</span>`;
}
export function accessibleTables(html,language){
 return html.replace(/<table>([\s\S]*?)<\/table>/g,(_,body)=>{
  const headings=[...body.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m=>tableTextSpeech(m[1],language));
  const result=body.replace(/<tbody>([\s\S]*?)<\/tbody>/g,(_,rows)=>'<tbody>'+rows.replace(/<tr>([\s\S]*?)<\/tr>/g,(_,cells)=>{
   const values=[...cells.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m=>tableTextSpeech(m[1],language));
   const speech=values.map((v,i)=>v?(headings[i]?headings[i]+': ':'')+v:'').filter(Boolean).join('. ')+'.';
   return `<tr class="spoken-table-row" tabindex="0" aria-label="${escape(speech)}">`+cells.replace(/<td>([\s\S]*?)<\/td>/g,(_,text)=>'<td>'+spokenCell(text,language)+'</td>')+'</tr>';
  })+'</tbody>').replace(/(<th[^>]*>)([\s\S]*?)(<\/th>)/g,(_,open,text,close)=>open+spokenCell(text,language)+close);
  return '<table>'+result+'</table>';
 });
}
