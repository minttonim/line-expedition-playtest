import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_RULES,seededRandom,newBoard,detect,scoreDetection} from '../rules.mjs';
import {planTargetSkill,randomSkillTarget,applyPuzzlePlan,SKILLS} from '../skills.mjs';
import {planExtraSkill,EXTRA_SKILLS} from '../roster.mjs';
const ids=Array.from({length:42},(_,i)=>String(i));
const colors=board=>board.slice().sort((a,b)=>a-b);
const base=()=>Array.from({length:42},(_,i)=>[0,1,3,4,5][i%5]);

test('gathering makes actual T and L recipes by moving existing leaves, without creating colors',()=>{
 for(const [donors,pattern] of [[[0,5,6,11,24,35,41],'T자'],[[0,5,24,35,41],'L자']]){
  const board=base();donors.forEach(i=>board[i]=2);
  const plan=planTargetSkill(2,'battle',board,ids,14),next=applyPuzzlePlan(board,ids,plan);
  assert.equal(plan.kind,'reorder');assert.equal(plan.patternName,pattern);
  assert.deepEqual(colors(next.board),colors(board));assert.deepEqual(next.ids.slice().sort(),ids.slice().sort());
  assert.ok(plan.shapeCells.every(i=>next.board[i]===2));
  const found=detect(next.board,DEFAULT_RULES);assert.ok(plan.shapeCells.every(i=>found.allCells.includes(i)));
  assert.ok(scoreDetection(found,DEFAULT_RULES,1).recipe.includes(pattern));
 }
});

test('gathering safely falls back to a four or three-stone line and refuses fewer leaves',()=>{
 for(const count of [0,1,2,3,4]){
  const board=base();[0,5,35,41].slice(0,count).forEach(i=>board[i]=2);
  const index=randomSkillTarget(2,'battle',board,ids,new Set(),()=>.5);
  if(count<3){assert.equal(index,null);continue;}
  const plan=planTargetSkill(2,'battle',board,ids,index),next=applyPuzzlePlan(board,ids,plan);
  assert.equal(plan.shapeCells.length,count);assert.ok(plan.shapeCells.every(i=>detect(next.board,DEFAULT_RULES).allCells.includes(i)));
 }
});

test('gathering preserves item positions, reserved identities and the complete board across sixty seeded boards',()=>{
 let exercised=0;
 for(let seed=1;seed<=60;seed++){
  const board=newBoard({...DEFAULT_RULES,seed},seededRandom(seed)),before=board.slice();
  const reserved=new Set(ids.filter((_,i)=>(i+seed)%9===0));
  const index=randomSkillTarget(2,'battle',board,ids,reserved,seededRandom(seed+100));
  if(index===null)continue;
  exercised++;
  const plan=planTargetSkill(2,'battle',board,ids,index,reserved),next=applyPuzzlePlan(board,ids,plan);
  assert.deepEqual(board,before);assert.equal(next.board.length,42);assert.equal(new Set(next.ids).size,42);
  assert.deepEqual(colors(next.board),colors(before));assert.deepEqual(next.ids.slice().sort(),ids.slice().sort());
  for(let i=0;i<42;i++)if(before[i]>=6||reserved.has(ids[i])){assert.equal(next.board[i],before[i]);assert.equal(next.ids[i],ids[i]);}
  assert.ok(plan.shapeCells.every(i=>next.board[i]===2));
  assert.ok(plan.shapeCells.every(i=>detect(next.board,DEFAULT_RULES).allCells.includes(i)));
 }
 assert.ok(exercised>=40);
});

test('frost forging changes exactly two ordinary stones into a bomb and cross and preserves identities',()=>{
 const board=base();board[3]=8;board[20]=7;const before=board.slice(),reserved=new Set(['41']);
 const plan=planExtraSkill(5,'battle',board,ids,14,reserved),next=applyPuzzlePlan(board,ids,plan);
 assert.equal(plan.kind,'createItems');assert.equal(plan.cells.length,2);assert.equal(new Set(plan.cells).size,2);
 assert.deepEqual(plan.itemTypes,[6,7]);assert.deepEqual(next.ids,ids);assert.deepEqual(board,before);
 assert.equal(next.board.filter((v,i)=>v!==before[i]).length,2);
 assert.ok(plan.cells.every((i,k)=>before[i]<6&&next.board[i]===plan.itemTypes[k]&&!reserved.has(ids[i])));
 assert.equal(next.board[3],8);assert.equal(next.board[20],7);assert.equal(next.board[41],before[41]);
});

test('forged items remain on the board until included in an actual match',()=>{
 const board=[0,1,2,3,4,5],smallIds=board.map((_,i)=>String(i)),rules={...DEFAULT_RULES,rows:1};
 const plan=planExtraSkill(5,'battle',board,smallIds,2),next=applyPuzzlePlan(board,smallIds,plan);
 assert.deepEqual(next.board,[0,1,6,3,4,7]);assert.deepEqual(detect(next.board,rules).allCells,[]);
 next.board[1]=0;const found=detect(next.board,rules);
 assert.ok(found.items.some(item=>item.index===2));assert.ok(!found.items.some(item=>item.index===5));assert.ok(found.allCells.includes(2)&&!found.allCells.includes(5));
});

test('forging refuses items, reserved targets and boards with fewer than two available ordinary stones',()=>{
 assert.equal(planExtraSkill(5,'battle',[6,7,8],['0','1','2'],0),null);
 assert.equal(planExtraSkill(5,'battle',[0,6,7],['0','1','2'],0),null);
 assert.equal(planExtraSkill(5,'battle',base(),ids,14,new Set(['14'])),null);
 assert.equal(SKILLS[1].axis,'column');assert.equal(SKILLS[2].axis,'pattern');assert.equal(EXTRA_SKILLS[2].axis,'items');
});
