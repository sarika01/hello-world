export const GET_ACTIVE_EVENTS = 'GET_ACTIVE_EVENTS';
export const FETCHED_ACTIVE_EVENTS = 'FETCHED_ACTIVE_EVENTS';
export const FAILED_GET_ACTIVE_EVENTS = 'FAILED_GET_ACTIVE_EVENTS';
export const RESET_ACTIVE_EVENTS = 'RESET_ACTIVE_EVENTS';
export const GET_EVENT_DETAILS = 'GET_EVENT_DETAILS';
export const FETCHED_EVENT_DETAILS = 'FETCHED_EVENT_DETAILS';
export const EVENT_DETAILS_ERROR = 'EVENT_DETAILS_ERROR';
export const GET_RESULTS = 'GET_RESULTS';
export const GET_RESULTS_SUCCESS = 'GET_RESULTS_SUCCESS';
export const GET_RESULTS_FAILED = 'GET_RESULTS_FAILED';

export function getActiveEvents(data) {
  return {
    type: GET_ACTIVE_EVENTS,
    data
  };
}
export function fetchedActiveEvents(data) {
  return {
    type: FETCHED_ACTIVE_EVENTS,
    data
  };
}
export function failedActiveEvents(data) {
  return {
    type: FAILED_GET_ACTIVE_EVENTS,
    data
  };
}
export function resetActiveEvents() {
	return {
		type: RESET_ACTIVE_EVENTS
	};
}
export function getEventDetails(data) {
	return {
		type: GET_EVENT_DETAILS,
    data
	};
}
export function fetchedEventDetails(data) {
	return {
		type: FETCHED_EVENT_DETAILS,
    data
	};
}
export function eventDetailsError(data) {
	return {
		type: EVENT_DETAILS_ERROR,
    data
	};
}
export function getResults() {
  return {
    type: GET_RESULTS
  };
}
export function getResultsSuccess(data) {
  return {
    type: GET_RESULTS_SUCCESS,
    data
  };
}
export function getResultsFailed(data) {
  return {
    type: GET_RESULTS_FAILED,
    data
  };
}