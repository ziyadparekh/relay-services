export function transitionAuthPhase(phase) {
  switch(phase) {
    case 1:
    return { type: 'INITIAL_REGISTER' };
    case 2:
    return { type: 'USER_INFORMATION' };
    case 3:
    return { type: 'CODE_VERIFICATION' };
    case 4:
    return { type: 'CARD_ACTIVATION' };
    default: 
    return { type: 'RESTART' };
  }
};