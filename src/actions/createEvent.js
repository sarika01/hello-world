export const CREATE_EVENT = 'CREATE_EVENT';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILED = 'CREATE_EVENT_FAILED';
export const GET_QUESTION_BUCKETS = 'GET_QUESTION_BUCKETS';
export const FETCHED_QUESTION_BUCKETS = 'FETCHED_QUESTION_BUCKETS';
export const GET_QUESTION_BUCKETS_ERROR = 'GET_QUESTION_BUCKETS_ERROR';

export function createEvent(data) {
  return {
    type: CREATE_EVENT,
    data
  };
}
export function createEventSuccess() {
  return {
    type: CREATE_EVENT_SUCCESS
  };
}
export function createEventFailed(data) {
  return {
    type: CREATE_EVENT_FAILED,
    data
  };
}
export function getQuestionBuckets() {
  return {
    type: GET_QUESTION_BUCKETS
  };
}
export function fetchedQuestionBuckets(data) {
  return {
    type: FETCHED_QUESTION_BUCKETS,
    data
  };
}
export function getQuestionBucketsError() {
  return {
    type: GET_QUESTION_BUCKETS_ERROR
  };
}
