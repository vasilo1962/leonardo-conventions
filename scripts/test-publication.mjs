import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readlink, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=await mkdtemp(resolve(tmpdir(),'conventions-release-test-'));
const receiver=resolve(import.meta.dirname,'receive-release.mjs');
try{
 const source=root+'/source', destination=root+'/published',game=root+'/game';
 await mkdir(source);await mkdir(game);await writeFile(game+'/index.html','GAME UNCHANGED');
 const sha='a'.repeat(40);
 async function archive(mode,body='approved'){
  await writeFile(source+'/index.html',body);
  const files={'index.html':createHash('sha256').update(body).digest('hex')};
  await writeFile(source+'/.release.json',JSON.stringify({sha,mode,basePath:mode==='publish'?'/conventions':'/conventions-preview/'+sha,files}));
  return execFileSync('tar',['--format=ustar','-C',source,'-czf','-','.']);
 }
 const run=(command,bytes)=>spawnSync(process.execPath,[receiver],{env:{...process.env,SSH_ORIGINAL_COMMAND:command,CONVENTIONS_TEST_ROOT:destination},input:bytes,encoding:'utf8'});
 const published=await archive('publish');
 assert.equal(run('publish '+sha,published).status,0);
 const original=await readlink(destination+'/current');
 assert.equal(await readFile(destination+'/current/conventions/index.html','utf8'),'approved');
 assert.notEqual(run('publish '+'b'.repeat(40),published).status,0);
 assert.equal(await readlink(destination+'/current'),original);
 assert.notEqual(run('sh -c whoami',published).status,0);
 await writeFile(source+'/index.html','tampered');
 const tampered=execFileSync('tar',['--format=ustar','-C',source,'-czf','-','.']);
 assert.notEqual(run('publish '+sha,tampered).status,0);
 assert.equal(await readlink(destination+'/current'),original);
 const preview=await archive('preview');
 assert.equal(run('preview '+sha,preview).status,0);
 assert.equal(await readFile(destination+'/previews/conventions-preview/'+sha+'/index.html','utf8'),'approved');
 assert.equal(await readlink(destination+'/current'),original);
 assert.equal(run('preview '+sha,preview).status,0);
 await symlink(game+'/index.html',source+'/escape');
 const linked=execFileSync('tar',['--format=ustar','-C',source,'-czf','-','.']);
 assert.notEqual(run('publish '+sha,linked).status,0);
 assert.equal(await readFile(game+'/index.html','utf8'),'GAME UNCHANGED');
 assert.equal(await readlink(destination+'/current'),original);
 console.log('Publication isolation: preview, immutable preview, atomic publish, stale commit, hash tampering, forbidden command and symlink rejection passed; game files untouched.');
}finally{await rm(root,{recursive:true,force:true});}
