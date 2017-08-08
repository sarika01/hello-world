import {
    GET_QUESTION_BUCKETS,
    FETCHED_QUESTION_BUCKETS,
    GET_QUESTION_BUCKETS_ERROR,
    CREATE_EVENT,
    CREATE_EVENT_SUCCESS,
    CREATE_EVENT_FAILED
} from '../actions/createEvent.js';

const initialState = {
  questionBuckets: [],
  createEventError: false,
  errorMessage: '',
  loading: false
}
const createEvent = (state = initialState, action) => {
  switch (action.type) {
    case GET_QUESTION_BUCKETS:
    case CREATE_EVENT:
      return {
        ...state,
        loading: true
      }
    case FETCHED_QUESTION_BUCKETS:
      return {
        ...state,
        loading: false,
        questionBuckets: action.data
      };
    case GET_QUESTION_BUCKETS_ERROR:
      return {
        ...state,
        loading: false
      };
    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        loading: false,
        createEventError: false
      };
    case CREATE_EVENT_FAILED:
      return {
        ...state,
        createEventError: true,
        errorMessage: 'error in creating event',
        loading: false
      };
    default:
      return state;
  }
}

export default createEvent;
