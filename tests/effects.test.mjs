import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {motionTime,burst} from '../effects.mjs';
test('OS reduced-motion preference cannot suppress gameplay drops and gem fragments',()=>{const oldMatchMedia=globalThis.matchMedia,oldDocument=globalThis.document;globalThis.matchMedia=()=>({matches:true});const fragments=[];globalThis.document={createElement:()=>({style:{},dataset:{},animate:()=>({onfinish:null})})};try{assert.equal(motionTime(),650);assert.equal(motionTime({kind:'swap'}),400);const rect={left:0,top:0,width:50,height:50},cell={getBoundingClientRect:()=>rect};burst({getBoundingClientRect:()=>rect,querySelector:()=>cell,append:el=>fragments.push(el)},[0],[1]);assert.equal(fragments.length,6);}finally{globalThis.matchMedia=oldMatchMedia;globalThis.document=oldDocument;}});
test('stylesheet does not globally collapse gameplay animations to near-zero duration',async()=>{const css=await readFile(new URL('../style.css',import.meta.url),'utf8');assert.ok(!css.includes('animation-duration:.01ms!important'));});
