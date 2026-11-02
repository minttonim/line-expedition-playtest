// Effects use the actual tile rectangles so their footprint follows mobile layout and deck swaps.
export function showExtraPuzzleVFX(identity,phase,cells,index){
 const board=document.querySelector('#board'),body=board.parentElement,br=board.getBoundingClientRect(),pr=body.getBoundingClientRect(),layer=document.createElement('div');
 layer.className='puzzle-vfx-layer extra-skill-vfx hero-fx-'+identity;
 layer.dataset.character=identity;layer.dataset.phase=phase;
 Object.assign(layer.style,{left:br.left-pr.left+'px',top:br.top-pr.top+'px',width:br.width+'px',height:br.height+'px'});
 const rect=i=>{const r=board.querySelector('[data-index="'+i+'"]')?.getBoundingClientRect();return r?{x:r.left-br.left,y:r.top-br.top,w:r.width,h:r.height}:null;};
 const center=rect(index);if(!center)return;
 const shape=(cls,style,html='')=>{const el=document.createElement('div');el.className=cls;Object.assign(el.style,style);el.innerHTML=html;layer.append(el);return el;};
 const tone=['','','','#ffe39d','#c5a0d6','#b2e9ee'][identity];layer.style.setProperty('--fx-color',tone);
 for(const i of cells){const r=rect(i);if(r)shape('extra-skill-cell',{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px',animationDelay:(cells.indexOf(i)*18)+'ms'});}
 if(phase==='prep'){
  if(identity===5){shape('frost-sort-beam',{left:center.x+'px',top:'0',width:center.w+'px',height:'100%'});}
  else for(const i of cells){const r=rect(i);if(r)shape('prep-sigil sigil-'+identity,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'},identity===3?'☀':'☾');}
 }else if(identity===3){
  shape('sun-cross-beam horizontal',{left:'-5%',top:center.y+center.h*.3+'px',width:'110%',height:center.h*.4+'px'});
  shape('sun-cross-beam vertical',{left:center.x+center.w*.3+'px',top:'-5%',width:center.w*.4+'px',height:'110%'});
  shape('sun-seal',{left:center.x-center.w*.15+'px',top:center.y-center.h*.15+'px',width:center.w*1.3+'px',height:center.h*1.3+'px'},'☀');
 }else if(identity===4){
  shape('eclipse-disc',{left:center.x-center.w+'px',top:center.y-center.h+'px',width:center.w*3+'px',height:center.h*3+'px'},'<i></i><b>☾</b>');
 }else{
  shape('frost-row-wave',{left:'-8%',top:center.y+'px',width:'116%',height:center.h+'px'},'<i></i><i></i><i></i>');
 }
 body.append(layer);setTimeout(()=>layer.remove(),1450);
}
