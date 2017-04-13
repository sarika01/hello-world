import {
    SET_USER,
    LOGIN_ERROR,
    REGISTER_ERROR,
    LOGOUT_USER_SUCCESS,
    FETCHED_PROFILE_IMAGE
} from '../actions/userSession';

const initialState = {
  user: null,
  username: '',
  role: '',
  loginError: false,
  registerError: false,
  errorMessage: '',
  loggedInStatus: false,
  loggedInTime: null,
  sessionId: null,
  userAvatar: null
}
const userSession = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data.data,
        username: action.data.name,
        role: action.data.role,
        loggedInStatus: true,
        loggedInTime: new Date(),
        sessionId: action.data.Ud
      }
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: true,
        errorMessage: 'login failed',
        loggedInStatus: false,
        loggedInTime: null
      };
    case REGISTER_ERROR:
      return {
        ...state,
        registerError: true,
        errorMessage: 'registration failed',
        loggedInStatus: false,
        loggedInTime: null
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        user: null,
        username: '',
        role: '',
        loginError: false,
        registerError: false,
        errorMessage: '',
        loggedInStatus: false,
        loggedInTime: null,
        sessionId: null
      };
    case FETCHED_PROFILE_IMAGE:
      return {
        ...state,
        userAvatar: action.data
      };
    default:
      return state
  }
}

export default userSession;
