// Each asset contains four painted animation frames in a 2×2 sheet.
export const SKILL_SPRITES=Object.freeze(Object.fromEntries([3,4,5].map(hero=>[hero,{prep:hero===4?'assets/fx-main-4-v2.png':`assets/fx-prep-${hero}-v1.png`,main:`assets/fx-main-${hero}-v${hero>=4?2:1}.png`}])));
export function showExtraPuzzleVFX(identity,phase,cells,index){
 const board=document.querySelector('#board'),body=board.parentElement,br=board.getBoundingClientRect(),pr=body.getBoundingClientRect(),layer=document.createElement('div');
 layer.className='puzzle-vfx-layer extra-skill-vfx hero-fx-'+identity;layer.dataset.character=identity;layer.dataset.phase=phase;layer.dataset.renderer='sprite-sheet';
 Object.assign(layer.style,{left:br.left-pr.left+'px',top:br.top-pr.top+'px',width:br.width+'px',height:br.height+'px'});
 const rect=i=>{const r=board.querySelector('[data-index="'+i+'"]')?.getBoundingClientRect();return r?{x:r.left-br.left,y:r.top-br.top,w:r.width,h:r.height}:null;};
 const center=rect(index);if(!center)return;
 // Let painted rays extend naturally beyond individual cells and the board.
 layer.style.overflow='visible';

 const add=(x,y,w,h,delay=0)=>{
  const clip=document.createElement('div');clip.className='skill-sprite-window';clip.dataset.frames='4';clip.dataset.frame='0';
  Object.assign(clip.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  const img=document.createElement('img');img.className='skill-sprite-sheet';img.src=SKILL_SPRITES[identity][phase];img.alt='';img.draggable=false;clip.append(img);layer.append(clip);
  const frames=['translate(0,0)','translate(-50%,0)','translate(0,-50%)','translate(-50%,-50%)'];img.style.transform=frames[0];[1,2,3].forEach(frame=>setTimeout(()=>{img.style.transform=frames[frame];clip.dataset.frame=String(frame);},delay+frame*275));
  const transforms=phase==='main'&&identity===5?['translateY(18%) scale(1,.5)','translateY(0) scale(1,1.1)','translateY(-2%) scale(1)','translateY(8%) scale(1,.85)']:identity===4?['rotate(-5deg) scale(.75)','rotate(0) scale(1.06)','rotate(5deg) scale(.92)','rotate(0) scale(.55)']:phase==='prep'&&identity===3?['rotate(-20deg) scale(.7)','rotate(-8deg) scale(1)','rotate(12deg) scale(1)','rotate(24deg) scale(.8)']:phase==='prep'&&identity===5?['translateY(12%) scale(.8)','translateY(0) scale(1)','translateY(-5%) scale(1)','translateY(-12%) scale(1.06)']:['scale(.7)','scale(1)','scale(1)','scale(1.06)'];
  clip.animate([{opacity:0,transform:transforms[0]},{opacity:1,transform:transforms[1],offset:.16},{opacity:1,transform:transforms[2],offset:.7},{opacity:0,transform:transforms[3]}],{duration:1200,delay,easing:'ease-out',fill:'both'});
 };
 if(phase==='prep'&&identity!==5){
  cells.forEach((i,k)=>{const r=rect(i);if(r)add(r.x-r.w*.3,r.y-r.h*.3,r.w*1.6,r.h*1.6,k*55);});
 }else if(phase==='prep')add(center.x-center.w*.45,0,center.w*1.9,br.height);
 else if(identity===3)add(center.x+center.w/2-br.width,center.y+center.h/2-br.height,br.width*2,br.height*2);
 else if(identity===4)add(center.x-center.w*1.2,center.y-center.h*1.2,center.w*3.4,center.h*3.4);
 else add(-br.width*.08,center.y-center.h*1.05,br.width*1.16,center.h*2.6);
 body.append(layer);setTimeout(()=>layer.remove(),1500);
}
