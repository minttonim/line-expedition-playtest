// Gathering swaps existing stones; it never creates colors, items, or identities.
const shapes=[
 {name:'T자',points:[[0,0],[-1,0],[-2,0],[1,0],[2,0],[0,1],[0,2]]},
 {name:'L자',points:[[0,0],[1,0],[2,0],[0,1],[0,2]]},
 {name:'직선 4',points:[[0,0],[1,0],[2,0],[3,0]]},
 {name:'직선 3',points:[[0,0],[1,0],[2,0]]}
];
export function planLeafGather(board,ids,index,reserved=new Set(),columns=6){
 if(!Number.isInteger(index)||index<0||index>=board.length)return null;
 const free=i=>Number.isInteger(board[i])&&board[i]>=0&&board[i]<6&&!reserved.has(ids[i]);
 const leaves=board.map((_,i)=>i).filter(i=>free(i)&&board[i]===2);
 if(leaves.length<3)return null;
 const row=Math.floor(index/columns),col=index%columns,rows=Math.ceil(board.length/columns);
 for(const shape of shapes){
  if(leaves.length<shape.points.length)continue;
  for(let turn=0;turn<4;turn++){
   const rotation=(turn+index)%4;
   const points=shape.points.map(([x,y])=>{for(let k=0;k<rotation;k++)[x,y]=[-y,x];return[col+x,row+y];});
   if(points.some(([c,r])=>c<0||c>=columns||r<0||r>=rows))continue;
   const shapeCells=points.map(([c,r])=>r*columns+c);
   if(shapeCells.some(i=>!free(i)))continue;
   const destinations=shapeCells.filter(i=>board[i]!==2);
   if(!destinations.length)continue;
   const donors=leaves.filter(i=>!shapeCells.includes(i)).sort((a,b)=>{
    const distance=i=>Math.abs(Math.floor(i/columns)-row)+Math.abs(i%columns-col);
    return distance(a)-distance(b)||a-b;
   }).slice(0,destinations.length);
   if(donors.length!==destinations.length)continue;
   const cells=[...shapeCells,...donors],swaps=new Map();
   destinations.forEach((dest,k)=>{swaps.set(dest,donors[k]);swaps.set(donors[k],dest);});
   return{hero:2,phase:'battle',kind:'reorder',axis:'pattern',cells,sources:cells.map(i=>swaps.get(i)??i),shapeCells,patternName:shape.name,color:2,index};
  }
 }
 return null;
}
