import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile, cp, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const read = async path => JSON.parse(await readFile(resolve(root,path),'utf8'));
const catalog = await read('catalog.json');
const languages = await read('languages.json');
const aliases = await read('redirects.json');
const preview = process.env.CONVENTIONS_MODE === 'preview';
const articles = [];
const ids = new Set();
for (const entry of catalog) {
  assert.match(entry.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(!ids.has(entry.id),'Duplicate convention: '+entry.id); ids.add(entry.id);
  for (const file of await readdir(resolve(root,'content',entry.id))) {
    if (!file.endsWith('.json')) continue;
    const language = file.slice(0,-5);
    assert(Object.hasOwn(languages,language),'Unknown language: '+language);
    const article = await read('content/'+entry.id+'/'+file);
    assert(['draft','published'].includes(article.status),'Explicit draft/published status required');
    assert.equal(article.conventionId,entry.id); assert.equal(article.language,language);
    assert.equal(article.slug,entry.id+'-'+language);
    assert.equal(typeof article.title,'string'); assert(article.title.trim());
    assert.equal(typeof article.group,'string'); assert(Array.isArray(article.sections));
    for (const section of article.sections) {
      assert(section.heading === undefined || typeof section.heading === 'string');
      assert(Array.isArray(section.lines)); assert(section.lines.every(line => typeof line === 'string'));
    }
    if (preview || article.status === 'published') articles.push(article);
  }
}
assert(articles.length,'No publishable articles');
const slugs = new Set(articles.map(article => article.slug));
assert.equal(slugs.size,articles.length);
const redirects = {};
for (const [from,to] of Object.entries(aliases)) {
  assert.match(from,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(!slugs.has(from),'Alias shadows article: '+from);
  assert(slugs.has(to),'Alias destination is not published: '+to);
  redirects[from] = to;
}
await mkdir(resolve(root,'src/generated'),{recursive:true});
await writeFile(resolve(root,'src/generated/conventions.json'),JSON.stringify({articles,redirects},null,2)+'\n');
await mkdir(resolve(root,'public'),{recursive:true});
const urls = ['https://leonardobridge.com/conventions',...articles.map(a=>'https://leonardobridge.com/conventions/'+a.slug)];
await writeFile(resolve(root,'public/sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>\n');
async function checkMedia(path) {
  for (const name of await readdir(path)) {
    const item=resolve(path,name), stat=await lstat(item);
    assert(!stat.isSymbolicLink(),'Media symlinks are not permitted');
    if (stat.isDirectory()) await checkMedia(item);
    else assert(/\.(png|jpe?g|webp|avif)$/i.test(name),'Unsupported media file: '+name);
  }
}
try {
  await checkMedia(resolve(root,'media'));
  await cp(resolve(root,'media'),resolve(root,'public/media'),{recursive:true});
} catch(error) { if(error.code !== 'ENOENT') throw error; }
console.log('Prepared '+articles.length+' independent convention translations.');
