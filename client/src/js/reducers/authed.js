import objectAssign from 'object-assign';

const initialState = {
  user: false,
  step: 1
};

export default function authed(state = initialState, action) {
  switch(action.type) {
    case "INITIAL_REGISTER":
    return objectAssign({}, state, {
      step: 2
    });
    case "USER_INFORMATION":
    return objectAssign({}, state, {
      step: 3
    });
    case "CODE_VERIFICATION":
    return objectAssign({}, state, {
      step: 4
    })
    default:
    return objectAssign({}, initialState);
  }
}