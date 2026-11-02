// # is a same-color stone; . must remain outside that same-color group.
export const SHAPE_RECIPES=Object.freeze([
 {id:'small-cross',name:'작은 십자',multiplier:1.9,pattern:['.#.','###','.#.']},
 {id:'stairs',name:'계단',multiplier:2.6,pattern:['###.','..##','...#','...#']},
 {id:'lightning',name:'번개',multiplier:2.7,pattern:['###..','..#..','..###']},
 {id:'cup',name:'U자',multiplier:2.8,pattern:['#.#','#.#','###']},
 {id:'bridge',name:'H자',multiplier:3,pattern:['#.#','###','#.#']},
 {id:'ring',name:'고리',multiplier:3.2,pattern:['###','#.#','###']},
 {id:'crown',name:'왕관',multiplier:3,pattern:['#.#.#','#####']},
 {id:'trident',name:'삼지창',multiplier:3.5,pattern:['#.#.#','#####','..#..']},
 {id:'square',name:'마법진',multiplier:3.6,pattern:['###','###','###']},
 {id:'diamond',name:'다이아몬드',multiplier:4.5,pattern:['..#..','.###.','#####','.###.','..#..']}
]);
function rotate(matrix){return Array.from({length:matrix[0].length},(_,r)=>Array.from({length:matrix.length},(_,c)=>matrix[matrix.length-1-c][r]).join(''));}
function variants(pattern){const result=[],seen=new Set();for(const start of [pattern,pattern.map(row=>[...row].reverse().join(''))]){let matrix=start;for(let turn=0;turn<4;turn++){const key=matrix.join('/');if(!seen.has(key)){seen.add(key);const required=[],empty=[];matrix.forEach((row,r)=>[...row].forEach((value,c)=>(value==='#'?required:empty).push([r,c])));result.push({required,empty,width:matrix[0].length,height:matrix.length});}matrix=rotate(matrix);}}return result;}
const compiled=SHAPE_RECIPES.map(recipe=>({...recipe,variants:variants(recipe.pattern)}));
export function matchingShapeRecipes(cells,columns=6){const set=new Set(cells),result=[];for(const recipe of compiled){if(set.size<recipe.variants[0].required.length)continue;let found=false;for(const variant of recipe.variants){const [firstRow,firstCol]=variant.required[0];for(const cell of set){const row=Math.floor(cell/columns)-firstRow,col=cell%columns-firstCol;if(row<0||col<0||col+variant.width>columns)continue;const present=([r,c])=>set.has((row+r)*columns+col+c);if(variant.required.every(present)&&variant.empty.every(p=>!present(p))){found=true;break;}}if(found)break;}if(found)result.push({id:recipe.id,name:recipe.name,multiplier:recipe.multiplier});}return result;}
