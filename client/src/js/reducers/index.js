import { combineReducers } from 'redux';
import fuelSavingsAppState from 'reducers/fuelSavings';
import authed from 'reducers/authed';

const rootReducer = combineReducers({
  fuelSavingsAppState,
  authed
});

export default rootReducer;