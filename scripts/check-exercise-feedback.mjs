import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { exerciseProgress, createAnswerSounds } from '../site/assets/convention-feedback.js';

const session = { questions: Array.from({length:10}, (_,index) => ({id:String(index),answer:'2NT'})), index:0, answers:new Map() };
assert.deepEqual(exerciseProgress(session), {current:1,total:10,answered:0,correct:0});
for (let i=0;i<5;i++) session.answers.set(String(i),i===2?'PASS':'2NT');
session.index=5;
assert.deepEqual(exerciseProgress(session), {current:6,total:10,answered:5,correct:4});
session.answers.set('5','PASS');
assert.deepEqual(exerciseProgress(session), {current:6,total:10,answered:6,correct:4});
const other = {...session,index:0,answers:new Map()};
assert.equal(exerciseProgress(other).correct,0);
assert.equal(exerciseProgress(session).correct,4);

let observer;
const scheduled = [];
let contexts = 0;
const listeners = {};
const environment = {
  document: {documentElement:{dataset:{}},visibilityState:'visible',addEventListener:(event,fn)=>{listeners[event]=fn;}},
  addEventListener:(event,fn)=>{listeners[event]=fn;},
  MutationObserver:class {constructor(fn){observer=fn;} observe(){}},
  AudioContext:class {
    constructor(){contexts++;this.state='running';this.currentTime=1;}
    createOscillator(){return {frequency:{setValueAtTime:(frequency)=>scheduled.push(frequency)},connect(){},disconnect(){},start(){},stop(){}};}
    createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
  }
};
const sounds = createAnswerSounds(environment);
sounds.play(true);
assert.equal(contexts,0,'Absent shared sound preference must be silent');
environment.document.documentElement.dataset.soundsEnabled='false';
sounds.play(false);
assert.equal(contexts,0,'Disabled sounds must not create an audio context');
environment.document.documentElement.dataset.soundsEnabled='true';
sounds.play(true);
assert.deepEqual(scheduled,[880]);
sounds.play(false);
assert.deepEqual(scheduled,[880,220,165]);
environment.document.documentElement.dataset.soundsEnabled='false'; observer(); sounds.play(true);
assert.equal(scheduled.length,3);
environment.document.documentElement.dataset.soundsEnabled='true';
environment.document.visibilityState='hidden'; listeners.visibilitychange(); sounds.play(true);
assert.equal(scheduled.length,3,'No background sound');
// A suspended audio context may resolve only after the preference was switched off.
let resume;
environment.document.visibilityState='visible';
environment.AudioContext=class extends environment.AudioContext {
  constructor(){super();this.state='suspended';}
  resume(){return new Promise(resolve=>{resume=()=>{this.state='running';resolve();};});}
};
const delayed = createAnswerSounds(environment);
delayed.play(true);
environment.document.documentElement.dataset.soundsEnabled='false';
resume(); await Promise.resolve(); await Promise.resolve();
assert.equal(scheduled.length,3,'Do not replay a delayed sound after muting');

for (const file of (await readdir('content/exercises')).filter(name=>name.endsWith('.el.json'))) {
  const slug=file.replace('.el.json','');
  const data=JSON.parse(await readFile(`content/exercises/${file}`,'utf8'));
  const html=await readFile(`site/${data.route || `el/${slug}/practice/`}index.html`,'utf8');
  assert.ok(html.includes('id="exercise-score">Σωστές: 0/0'));
  assert.ok(html.includes('id="exercise-progress">Άσκηση: 1/10'));
  assert.ok(html.includes('class="exercise-counts" role="status"'));
}
console.log('Verified all exercise sets: separate progress/answered scores, independent groups, shared sound preference mute by default, distinct feedback tones, live muting, background silence and cancelled delayed audio.');
