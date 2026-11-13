import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..'), dist=resolve(root,process.argv[2]||'dist');
const registry=JSON.parse(await readFile(resolve(root,'src/generated/conventions.json'),'utf8'));
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const mode=process.env.CONVENTIONS_MODE||'preview';
assert(['preview','publish'].includes(mode));
const basePath=process.env.CONVENTIONS_BASE_PATH||'/conventions';
assert.equal(basePath,mode==='publish'?'/conventions':'/conventions-preview/'+sha);
const localizedPages = [...registry.articles, ...Object.entries(registry.redirects).map(([slug,target])=>({...registry.articles.find(article=>article.slug===target),slug}))];
for(const article of localizedPages){
  const path=resolve(dist,article.slug+'.html');
  const html=await readFile(path,'utf8');
  const direction=['ar','he'].includes(article.language)?'rtl':'ltr';
  await writeFile(path,html.replace(/<html\b[^>]*>/,'<html lang="'+article.language+'" dir="'+direction+'">'));
}
const files={};
async function scan(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=resolve(dir,entry.name);
  if(entry.isDirectory())await scan(path);
  else files[relative(dist,path)]=createHash('sha256').update(await readFile(path)).digest('hex');
 }
}
await scan(dist);
await writeFile(resolve(dist,'.release.json'),JSON.stringify({sha,mode,basePath,files},null,2)+'\n');
console.log('Prepared '+mode+' release '+sha.slice(0,7));
