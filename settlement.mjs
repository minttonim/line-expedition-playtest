// Time-up closes input; settlement waits for every producer of a later cascade or hit.
export function canFinishSettlement(state,now){
 return !state.resolving&&!state.resolvePending&&!state.casting.some(Boolean)
  &&state.pendingVisual.size===0&&state.pendingAttacks===0
  &&now>=state.fallUntil&&now>=state.visualUntil;
}
