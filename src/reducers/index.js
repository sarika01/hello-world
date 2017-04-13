import {combineReducers} from 'redux';
import userSession from './userSession';
import activeEvents from './activeEvents';
import userEvents from './userEvents';

const appReducer = combineReducers({
    userSession,
    activeEvents,
    userEvents
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER_SUCCESS') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;