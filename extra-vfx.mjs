// Each asset contains four painted animation frames in a 2×2 sheet.
export const SKILL_SPRITES=Object.freeze(Object.fromEntries([3,4,5].map(hero=>[hero,{prep:`assets/fx-prep-${hero}-v1.png`,main:`assets/fx-main-${hero}-v1.png`}])));
export function showExtraPuzzleVFX(identity,phase,cells,index){
 const board=document.querySelector('#board'),body=board.parentElement,br=board.getBoundingClientRect(),pr=body.getBoundingClientRect(),layer=document.createElement('div');
 layer.className='puzzle-vfx-layer extra-skill-vfx hero-fx-'+identity;layer.dataset.character=identity;layer.dataset.phase=phase;layer.dataset.renderer='sprite-sheet';
 Object.assign(layer.style,{left:br.left-pr.left+'px',top:br.top-pr.top+'px',width:br.width+'px',height:br.height+'px'});
 const rect=i=>{const r=board.querySelector('[data-index="'+i+'"]')?.getBoundingClientRect();return r?{x:r.left-br.left,y:r.top-br.top,w:r.width,h:r.height}:null;};
 const center=rect(index);if(!center)return;
 if(phase==='main'&&identity===3){
  const x0=center.x-center.w*.15,x1=center.x+center.w*1.15,y0=center.y-center.h*.15,y1=center.y+center.h*1.15;
  layer.style.clipPath=`polygon(${x0}px 0,${x1}px 0,${x1}px ${y0}px,100% ${y0}px,100% ${y1}px,${x1}px ${y1}px,${x1}px 100%,${x0}px 100%,${x0}px ${y1}px,0 ${y1}px,0 ${y0}px,${x0}px ${y0}px)`;
 }

 const add=(x,y,w,h,delay=0)=>{
  const clip=document.createElement('div');clip.className='skill-sprite-window';clip.dataset.frames='4';clip.dataset.frame='0';
  Object.assign(clip.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  const img=document.createElement('img');img.className='skill-sprite-sheet';img.src=SKILL_SPRITES[identity][phase];img.alt='';img.draggable=false;clip.append(img);layer.append(clip);
  img.animate([{transform:'translate(0,0)',offset:0},{transform:'translate(-50%,0)',offset:.25},{transform:'translate(0,-50%)',offset:.5},{transform:'translate(-50%,-50%)',offset:.75},{transform:'translate(-50%,-50%)',offset:1}].map(frame=>({...frame,easing:'steps(1,end)'})),{duration:1100,delay,easing:'linear',fill:'both'});[1,2,3].forEach(frame=>setTimeout(()=>clip.dataset.frame=String(frame),delay+frame*275));
  const transforms=phase==='main'&&identity===5?['translateX(-55%) scale(.8)','translateX(-8%) scale(1)','translateX(12%) scale(1)','translateX(45%) scale(1.06)']:identity===4||phase==='prep'&&identity===3?['rotate(-20deg) scale(.7)','rotate(-8deg) scale(1)','rotate(12deg) scale(1)','rotate(24deg) scale(.8)']:phase==='prep'&&identity===5?['translateY(12%) scale(.8)','translateY(0) scale(1)','translateY(-5%) scale(1)','translateY(-12%) scale(1.06)']:['scale(.7)','scale(1)','scale(1)','scale(1.06)'];
  clip.animate([{opacity:0,transform:transforms[0]},{opacity:1,transform:transforms[1],offset:.16},{opacity:1,transform:transforms[2],offset:.7},{opacity:0,transform:transforms[3]}],{duration:1200,delay,easing:'ease-out',fill:'both'});
 };
 if(phase==='prep'&&identity!==5){
  cells.forEach((i,k)=>{const r=rect(i);if(r)add(r.x-r.w*.3,r.y-r.h*.3,r.w*1.6,r.h*1.6,k*55);});
 }else if(phase==='prep')add(center.x-center.w*.45,0,center.w*1.9,br.height);
 else if(identity===3)add(center.x+center.w/2-br.width,center.y+center.h/2-br.height,br.width*2,br.height*2);
 else if(identity===4)add(center.x-center.w*1.2,center.y-center.h*1.2,center.w*3.4,center.h*3.4);
 else add(-br.width*.08,center.y-center.h*.4,br.width*1.16,center.h*1.8);
 body.append(layer);setTimeout(()=>layer.remove(),1500);
}
