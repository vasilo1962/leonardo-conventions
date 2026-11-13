import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,process.argv[2]||'dist');
const registry=JSON.parse(await readFile(resolve(root,'src/generated/conventions.json'),'utf8'));
const release=JSON.parse(await readFile(resolve(dist,'.release.json'),'utf8'));
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
for(const article of registry.articles){
 const html=await readFile(resolve(dist,article.slug+'.html'),'utf8');
 assert(html.includes('<html lang="'+article.language+'"'),article.slug+' language');
 assert(html.includes('https://leonardobridge.com/conventions/'+article.slug),article.slug+' canonical');
 assert(html.includes(escape(article.title)),article.slug+' title');
 for(const section of article.sections)for(const line of section.lines)if(line)assert(html.includes(escape(line)),article.slug+' server-rendered content: '+line);
 assert(!/(?:src|href)="\/_expo\//.test(html),'Game asset path leaked into '+article.slug);
 const ownScripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert(ownScripts.length,article.slug+' missing scripts');
 for(const path of ownScripts){
  assert(path.startsWith(release.basePath+'/'),article.slug+' asset prefix '+path);
  await access(resolve(dist,path.slice(release.basePath.length+1)));
 }
}
for(const [alias,target]of Object.entries(registry.redirects)){
 const html=await readFile(resolve(dist,alias+'.html'),'utf8');
 assert(html.includes('https://leonardobridge.com/conventions/'+target),'Legacy URL canonical '+alias);
}
const sitemap=await readFile(resolve(dist,'sitemap.xml'),'utf8');
for(const article of registry.articles)assert(sitemap.includes('/conventions/'+article.slug));
console.log('Standalone export: '+registry.articles.length+' localized HTML pages, real server-rendered text, language, canonicals, independent assets, legacy links and sitemap passed.');
