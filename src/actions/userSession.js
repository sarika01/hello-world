export const SET_USER = 'SET_USER';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_ERROR = 'LOGOUT_USER_ERROR';
export const ADD_USER_NAME = 'ADD_USER_NAME';
export const GET_PROFILE_IMAGE = 'GET_PROFILE_IMAGE';
export const FETCHED_PROFILE_IMAGE = 'FETCHED_PROFILE_IMAGE';
export const PROFILE_IMAGE_ERROR = 'PROFILE_IMAGE_ERROR';

export function setUser(data) {
  return {
    type: SET_USER,
    data
  };
}
export function loginError(data) {
  return {
    type: LOGIN_ERROR,
    data
  };
}
export function registerError(data) {
  return {
    type: REGISTER_ERROR,
    data
  };
}
export function logoutUser() {
  return {
    type: LOGOUT_USER
  }
}
export function logoutUserSuccess() {
  return {
    type: LOGOUT_USER_SUCCESS
  }
}
export function logoutUserError(data) {
  return {
    type: LOGOUT_USER_ERROR,
    data
  }
}
export function addUserName(data) {
  return {
    type: ADD_USER_NAME,
    data
  };
}
export function getProfileImage(data) {
  return {
    type: GET_PROFILE_IMAGE,
    data
  };
}
export function fetchedProfileImage(data) {
  return {
    type: FETCHED_PROFILE_IMAGE,
    data
  };
}
export function profileImageError(data) {
  return {
    type: PROFILE_IMAGE_ERROR,
    data
  };
}
