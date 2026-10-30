// Combo timing is independent of rendering, skill charging, and battle time.
export function createComboState(windowMs=4000){return{count:0,windowMs,expiresAt:0,busyDepth:0,remaining:0,hitDuringBusy:false};}
export function comboCount(combo,now){if(!combo.busyDepth&&now>combo.expiresAt)combo.count=0;return combo.count;}
export function beginComboProcessing(combo,now){if(combo.busyDepth===0){comboCount(combo,now);combo.remaining=Math.max(0,combo.expiresAt-now);combo.hitDuringBusy=false;}combo.busyDepth++;}
export function addComboHit(combo,now){comboCount(combo,now);combo.count++;if(combo.busyDepth)combo.hitDuringBusy=true;else combo.expiresAt=now+combo.windowMs;return combo.count;}
export function endComboProcessing(combo,now){if(combo.busyDepth===0)return;combo.busyDepth--;if(combo.busyDepth===0)combo.expiresAt=now+(combo.hitDuringBusy?combo.windowMs:combo.remaining);}
