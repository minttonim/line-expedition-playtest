export const PREP_SKILLS=Object.freeze([
 {name:'화염 각인',description:'무작위 일반 돌 2개를 불로 변환',color:0},
 {name:'물빛 전환',description:'무작위 일반 돌 2개를 물로 변환',color:1},
 {name:'조준 정렬',description:'무작위 행의 돌을 같은 색끼리 정렬'}
]);
export const SKILLS=Object.freeze([
 {name:'화염 폭발',color:'#f1a26f',axis:'color',description:'판 전체의 빨간 불 블록을 모두 제거'},
 {name:'물결 쇄도',color:'#91def1',axis:'column',description:'무작위 세로 한 줄을 물결로 제거'},
 {name:'관통 사격',color:'#bddb86',axis:'column',description:'무작위 열을 화살로 관통해 블록 제거'}
]);
export const SKILL_CHARGE=Object.freeze({initial:45,perSecond:3,perStone:8});
export function chargeOverTime(gauge,seconds){return Math.min(100,Math.max(0,gauge)+Math.max(0,seconds)*SKILL_CHARGE.perSecond);}
export const heroForColor=color=>[0,1,2,1,2,0][color];
export function randomSkillTarget(hero,phase,board,ids,reserved=new Set(),rng=Math.random,columns=6){if(hero===0&&phase==='battle')return planTargetSkill(hero,phase,board,ids,0,reserved,columns)?0:null;const axis=phase==='prep'?'row':SKILLS[hero].axis;const indices=axis==='row'?Array.from({length:Math.ceil(board.length/columns)},(_,i)=>i*columns):Array.from({length:columns},(_,i)=>i);const valid=indices.filter(i=>planTargetSkill(hero,phase,board,ids,i,reserved,columns));return valid.length?valid[Math.floor(rng()*valid.length)]:null;}
export function chargeForCells(board,cells,excludedHero=null){const gain=[0,0,0];for(const i of new Set(cells)){const hero=heroForColor(board[i]);if(hero!==undefined&&hero!==excludedHero)gain[hero]+=SKILL_CHARGE.perStone;}return gain;}
export function skillAvailability(gauge){const value=Math.max(0,Math.min(100,gauge));return{ready:value>=100,gauge:value};}

export function applyPuzzlePlan(board,ids,plan){const next=board.slice(),nextIds=ids.slice();if(plan.kind==='convert'){for(const i of plan.cells)next[i]=plan.color;}else for(let k=0;k<plan.cells.length;k++){next[plan.cells[k]]=board[plan.sources[k]];nextIds[plan.cells[k]]=ids[plan.sources[k]];}return{board:next,ids:nextIds};}

export function planTargetSkill(hero,phase,board,ids,index,reserved=new Set(),columns=6){const free=i=>!reserved.has(ids[i]);if(hero===0&&phase==='battle'){const cells=board.map((_,i)=>i).filter(i=>board[i]===0&&free(i));return cells.length?{hero,phase,kind:'clear',axis:'color',color:0,cells,index:cells[0]}:null;}const row=Math.floor(index/columns),col=index%columns;const axis=phase==='prep'?'row':SKILLS[hero].axis;const range=board.map((_,i)=>i).filter(i=>(axis==='row'?Math.floor(i/columns)===row:i%columns===col)&&free(i));if(phase==='prep'&&hero===2){const cells=range.filter(i=>board[i]<6);if(cells.length<2)return null;const sources=cells.slice().sort((a,b)=>(board[a]===2?-1:board[a])-(board[b]===2?-1:board[b])||a-b);if(cells.every((i,k)=>i===sources[k]))return null;return{hero,phase,kind:'reorder',axis,row,cells,sources,index};}return range.length?{hero,phase,kind:'clear',axis,cells:range,index}:null;}
