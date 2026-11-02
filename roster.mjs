export const HEROES=Object.freeze([
 {id:'knight',name:'기사',attribute:'불',color:0,tint:'#d78168',popup:'FIRE BURST!'},
 {id:'mage',name:'마법사',attribute:'물',color:1,tint:'#83bed6',popup:'WATER WAVE!'},
 {id:'ranger',name:'정찰병',attribute:'풀',color:2,tint:'#a5bc7c',popup:'PIERCE!'},
 {id:'cleric',name:'사제',attribute:'빛',color:3,tint:'#dfbd71',popup:'SUN CROSS!'},
 {id:'shaman',name:'주술사',attribute:'어둠',color:4,tint:'#ad91bd',popup:'MOON ECLIPSE!'},
 {id:'guardian',name:'수호자',attribute:'서리',color:5,tint:'#a0d8dc',popup:'FROST BREAK!'}
]);
export const EXTRA_PREP_SKILLS=Object.freeze([
 {name:'새벽의 세 빛',description:'무작위 가로 연속 3칸을 빛으로 변환',color:3},
 {name:'달의 낙인',description:'무작위 일반 돌 3개를 어둠으로 변환',color:4},
 {name:'빙결 정렬',description:'무작위 세로 한 줄을 같은 색끼리 정렬'}
]);
export const EXTRA_SKILLS=Object.freeze([
 {name:'태양의 십자',color:'#ffe29b',axis:'cross',description:'무작위 중심에서 가로·세로 십자 제거'},
 {name:'월식',color:'#c5a6db',axis:'area',description:'무작위 중심의 3×3 영역을 제거'},
 {name:'서리 파쇄',color:'#b5f1ed',axis:'row',description:'무작위 가로 한 줄을 얼음 파동으로 제거'}
]);
export function chargePartyForCells(board,cells,excludedHero=null,party=[0,1,2]){
 const gain=party.map(()=>0);
 for(const i of new Set(cells))for(let slot=0;slot<party.length;slot++)if(party[slot]!==excludedHero&&HEROES[party[slot]].color===board[i])gain[slot]+=8;
 return gain;
}
export function planExtraSkill(hero,phase,board,ids,index,reserved=new Set(),columns=6){
 const free=i=>board[i]!==null&&!reserved.has(ids[i]),row=Math.floor(index/columns),col=index%columns,rows=Math.ceil(board.length/columns),axis=phase==='prep'?'column':EXTRA_SKILLS[hero-3].axis;
 if(axis==='area'&&(row===0||row===rows-1||col===0||col===columns-1))return null;
 const range=board.map((_,i)=>i).filter(i=>{const r=Math.floor(i/columns),c=i%columns;return free(i)&&(axis==='row'?r===row:axis==='cross'?r===row||c===col:axis==='area'?Math.abs(r-row)<=1&&Math.abs(c-col)<=1:c===col);});
 if(phase==='prep'){
  if(hero!==5)return null;
  const cells=range.filter(i=>board[i]<6),sources=cells.slice().sort((a,b)=>(board[a]===5?-1:board[a])-(board[b]===5?-1:board[b])||a-b);
  if(cells.length<2||cells.every((i,k)=>i===sources[k]))return null;
  return{hero,phase,kind:'reorder',axis,cells,sources,index};
 }
 return range.length?{hero,phase,kind:'clear',axis,cells:range,index}:null;
}
export function randomExtraTarget(hero,phase,board,ids,reserved=new Set(),rng=Math.random,columns=6){
 const axis=phase==='prep'?'column':EXTRA_SKILLS[hero-3].axis;
 const indices=axis==='row'?Array.from({length:Math.ceil(board.length/columns)},(_,i)=>i*columns):axis==='column'?Array.from({length:columns},(_,i)=>i):board.map((_,i)=>i);
 const valid=indices.filter(i=>planExtraSkill(hero,phase,board,ids,i,reserved,columns));
 return valid.length?valid[Math.floor(rng()*valid.length)]:null;
}
export function planExtraPrep(hero,board,ids,rng=Math.random,columns=6){
 if(hero===5){const i=randomExtraTarget(hero,'prep',board,ids,new Set(),rng,columns);return i===null?null:planExtraSkill(hero,'prep',board,ids,i,new Set(),columns);}
 const color=hero;
 if(hero===3){
  const runs=[];for(let i=0;i<board.length;i++)if(i%columns<=columns-3){const cells=[i,i+1,i+2];if(cells.every(j=>board[j]!==null&&board[j]<6)&&cells.some(j=>board[j]!==color))runs.push(cells);}
  if(!runs.length)return null;const cells=runs[Math.floor(rng()*runs.length)];return{hero,phase:'prep',kind:'convert',axis:'row',cells,color,index:cells[0]};
 }
 const candidates=board.map((_,i)=>i).filter(i=>board[i]!==null&&board[i]<6&&board[i]!==color),cells=[];
 while(candidates.length&&cells.length<3)cells.push(candidates.splice(Math.floor(rng()*candidates.length),1)[0]);
 return cells.length?{hero,phase:'prep',kind:'convert',axis:'color',cells,color,index:cells[0]}:null;
}
