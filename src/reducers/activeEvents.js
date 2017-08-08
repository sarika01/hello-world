import {
    GET_ACTIVE_EVENTS,
    FETCHED_ACTIVE_EVENTS,
    FAILED_GET_ACTIVE_EVENTS,
    RESET_ACTIVE_EVENTS,
    GET_EVENT_DETAILS,
    FETCHED_EVENT_DETAILS,
    EVENT_DETAILS_ERROR,
    GET_RESULTS,
    GET_RESULTS_SUCCESS,
    GET_RESULTS_FAILED
} from '../actions/activeEvents.js';

const initialState = {
  activeEvents: [],
  activeEventsError: false,
  errorMessage: '',
  loading: false,
  eventDetails: null,
  eventDetailsError: false,
  allResults: [],
  allResultsError: false
}
const activeEvents = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACTIVE_EVENTS:
      return {
        ...state,
        loading: true,
        activeEventsError: false,
        errorMessage: ''
      };
    case GET_EVENT_DETAILS:
    case GET_RESULTS:
      return {
        ...state,
        loading: true
      }
    case FETCHED_ACTIVE_EVENTS:
      return {
        ...state,
        loading: false,
        activeEvents: action.data
      };
    case FAILED_GET_ACTIVE_EVENTS:
      return {
        ...state,
        loading: false,
        activeEventsError: true,
        errorMessage: action.data.message
      };
    case RESET_ACTIVE_EVENTS:
			return {
				...state,
				activeEvents: [],
				activeEventsError: false,
				errorMessage: '',
				loading: false,
        eventDetails: null,
        eventDetailsError: false
			};
    case FETCHED_EVENT_DETAILS:
      return {
        ...state,
        eventDetails: action.data,
        loading: false,
        eventDetailsError: false
      };
    case EVENT_DETAILS_ERROR:
      return {
        ...state,
        eventDetailsError: action.data,
        eventDetails: null,
        loading: false
      };
    case GET_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        allResults: action.data
      };
    case GET_RESULTS_FAILED:
      return {
        ...state,
        loading: false,
        allResultsError: true,
        errorMessage: action.data.message
      };
    default:
      return state
  }
}

export default activeEvents;
