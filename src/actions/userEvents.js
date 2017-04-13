export const GET_USER_EVENT = 'GET_USER_EVENT';
export const FETCHED_USER_EVENT = 'FETCHED_USER_EVENT';
export const FAILED_GET_USER_EVENT = 'FAILED_GET_USER_EVENT';
export const RESET_USER_EVENT = 'RESET_USER_EVENT';
export const GET_USER_SCORE = 'GET_USER_SCORE';
export const FETCHED_USER_SCORE = 'FETCHED_USER_SCORE';
export const USER_SCORE_ERROR = 'USER_SCORE_ERROR';
export const REGISTER_ANSWER = 'REGISTER_ANSWER';
export const REGISTER_ANSWER_SUCCESS = 'REGISTER_ANSWER_SUCCESS';
export const REGISTER_ANSWER_FAILED = 'REGISTER_ANSWER_FAILED';

export function getUserEvent(data) {
  return {
    type: GET_USER_EVENT,
    data
  };
}
export function fetchedUserEvent(data) {
  return {
    type: FETCHED_USER_EVENT,
    data
  };
}
export function failedUserEvent(data) {
  return {
    type: FAILED_GET_USER_EVENT,
    data
  };
}
export function resetUserEvent() {
	return {
		type: RESET_USER_EVENT
	};
}
export function getUserScore(data) {
	return {
		type: GET_USER_SCORE,
    data
	};
}
export function fetchedUserScore(data) {
	return {
		type: FETCHED_USER_SCORE,
    data
	};
}
export function userScoreError(data) {
	return {
		type: USER_SCORE_ERROR,
    data
	};
}
export function registerAnswer(data) {
	return {
		type: REGISTER_ANSWER,
    data
	};
}
export function registerAnswerSuccess(data) {
	return {
		type: REGISTER_ANSWER_SUCCESS,
    data
	};
}
export function registerAnswerFailed(data) {
	return {
		type: REGISTER_ANSWER_FAILED,
    data
	};
}
