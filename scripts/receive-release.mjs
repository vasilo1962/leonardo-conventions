// Root-owned forced SSH command for the dedicated convention publisher.
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile, rename, symlink, rm, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=process.env.CONVENTIONS_TEST_ROOT||'/opt/leonardo-conventions';
const match=/^(preview|publish) ([0-9a-f]{40})$/.exec(process.env.SSH_ORIGINAL_COMMAND||'');
assert(match,'Only preview/publish with an exact commit is permitted');
const [,mode,sha]=match;
let length=0;const chunks=[];
for await(const chunk of process.stdin){length+=chunk.length;assert(length<=32*1024*1024,'Archive too large');chunks.push(chunk);}
const tar=gunzipSync(Buffer.concat(chunks),{maxOutputLength:128*1024*1024});
const files=new Map();let offset=0;
while(offset+512<=tar.length){
 const header=tar.subarray(offset,offset+512);offset+=512;
 if(header.every(byte=>byte===0))break;
 const field=(from,to)=>header.subarray(from,to).toString('utf8').replace(/\0.*$/s,'');
 const numeric=(from,to)=>{const v=field(from,to).trim();assert(/^[0-7]+$/.test(v));return parseInt(v,8);};
 const checksum=numeric(148,156);
 let sum=0;for(let i=0;i<512;i++)sum+=i>=148&&i<156?32:header[i];assert.equal(sum,checksum,'Invalid archive header');
 const name=(field(345,500)?field(345,500)+'/':'')+field(0,100);
 const path=name.replace(/^\.\//,'').replace(/\/$/,'');
 const type=field(156,157), size=numeric(124,136);
 assert(['','0','5'].includes(type),'Links and extended archive entries are forbidden');
 assert(offset+size<=tar.length,'Truncated archive');
 if(path){
  assert(/^[A-Za-z0-9_@+./-]+$/.test(path)&&!path.startsWith('/')&&!path.split('/').some(p=>p==='..'||p==='.git'),'Unsafe archive path');
  if(type!=='5'){assert(!files.has(path),'Duplicate archive file');files.set(path,tar.subarray(offset,offset+size));}
 }else assert.equal(type,'5');
 offset+=Math.ceil(size/512)*512;
}
assert(files.has('.release.json'),'Release manifest is required');
const manifest=JSON.parse(files.get('.release.json').toString('utf8'));
assert.equal(manifest.sha,sha);assert.equal(manifest.mode,mode);
assert.equal(manifest.basePath,mode==='publish'?'/conventions':'/conventions-preview/'+sha);
assert(files.has('index.html'),'Missing convention index');
const declared=Object.keys(manifest.files);
assert.equal(declared.length,files.size-1,'Unexpected files');
for(const name of declared){assert(files.has(name));assert.equal(createHash('sha256').update(files.get(name)).digest('hex'),manifest.files[name],'Release hash mismatch: '+name);}
await mkdir(root+'/releases',{recursive:true});
const stage=root+'/releases/'+mode+'-'+sha+'-'+randomUUID();
await mkdir(stage);
try{
 const output=stage+(mode==='publish'?'/conventions':'');
 await mkdir(output,{recursive:true});
 for(const [name,bytes]of files){const path=resolve(output,name);assert(path.startsWith(output+'/'));await mkdir(resolve(path,'..'),{recursive:true});await writeFile(path,bytes,{mode:0o644});}
 if(mode==='preview'){
  const target=root+'/previews/conventions-preview/'+sha;
  await mkdir(resolve(target,'..'),{recursive:true});
  try{await rename(stage,target);}catch(error){if(!['EEXIST','ENOTEMPTY'].includes(error.code))throw error;
   const old=JSON.parse(await readFile(target+'/.release.json','utf8'));
   assert.deepEqual(old,manifest,'Preview already exists with different content');await rm(stage,{recursive:true,force:true});
  }
 }else{
  const pointer=root+'/.current-'+randomUUID();
  await symlink(stage,pointer);await rename(pointer,root+'/current');
 }
 console.log(mode+' '+sha.slice(0,7)+' ready');
}catch(error){await rm(stage,{recursive:true,force:true});throw error;}
