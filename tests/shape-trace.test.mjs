import test from 'node:test';
import assert from 'node:assert/strict';
import {connectedShapeTrace} from '../shape-trace.mjs';
test('a U shape is drawn and cleared continuously from one tip to the other',()=>{const trace=connectedShapeTrace([0,2,6,8,12,13,14]);assert.deepEqual(trace.order,[0,6,12,13,14,8,2]);assert.equal(trace.edges.length,6);});
test('closed rings include their final closing edge without clearing any stone twice',()=>{const cells=[0,1,2,6,8,12,13,14],trace=connectedShapeTrace(cells);assert.equal(trace.edges.length,8);assert.equal(trace.order.length,8);assert.equal(new Set(trace.order).size,8);assert.equal(new Set(trace.edges.map(([a,b])=>[a,b].sort((x,y)=>x-y).join(':'))).size,8);});
test('connections respect board columns and never join diagonal or wrapped neighbors',()=>{assert.deepEqual(connectedShapeTrace([3,4],4).edges,[]);assert.deepEqual(connectedShapeTrace([0,5],4).edges,[]);assert.equal(connectedShapeTrace([0,1,5],4).edges.length,2);});
