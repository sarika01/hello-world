import {
    GET_USER_EVENT,
    FETCHED_USER_EVENT,
    FAILED_GET_USER_EVENT,
    RESET_USER_EVENT,
    GET_USER_SCORE,
    FETCHED_USER_SCORE,
    USER_SCORE_ERROR,
    REGISTER_ANSWER,
    REGISTER_ANSWER_SUCCESS,
    REGISTER_ANSWER_FAILED
} from '../actions/userEvents.js';

const initialState = {
  userEvent: null,
  userEventError: false,
  errorMessage: '',
  loading: false,
  userScore: null,
  userScoreError: false,
  updating: false,
  updateError: null
}
const userEvents = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_EVENT:
    case GET_USER_SCORE:
      return {
        ...state,
        loading: true,
        userEventError: false,
        userScore: null
      }
    case FETCHED_USER_EVENT:
      return {
        ...state,
        loading: false,
        userEvent: action.data
      };
    case FAILED_GET_USER_EVENT:
      return {
        ...state,
        loading: false,
        userEventError: true,
        errorMessage: action.data.message
      };
    case RESET_USER_EVENT:
        return {
            ...state,
            userEvent: null,
            userEventError: false,
            errorMessage: '',
            loading: false,
            userScore: null,
            userScoreError: false
			};
    case FETCHED_USER_SCORE:
      return {
        ...state,
        userScore: action.data,
        loading: false,
        userScoreError: false
      };
    case USER_SCORE_ERROR:
      return {
        ...state,
        userScoreError: action.data,
        userScore: null,
        loading: false
      };
    case REGISTER_ANSWER:
      return {
        ...state,
        updating: true,
        updateError: null
      };
    case REGISTER_ANSWER_SUCCESS:
      return {
        ...state,
        updating: false,
        userEvent: action.data
      };
    case REGISTER_ANSWER_FAILED:
      return {
        ...state,
        updating: false,
        updateError: action.data.message
      };
    default:
      return state
  }
}

export default userEvents;
