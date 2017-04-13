import * as userSessionActions from '../actions/userSession';
import {put, call, fork} from 'redux-saga/effects';
import {takeEvery} from 'redux-saga';
import * as firebase from 'firebase';
import {browserHistory} from 'react-router';

function logoutUser(){
  return new Promise(function(resolve, reject) {
    // firebase.auth().signOut().then(function() {
    //   // Sign-out successful.
    //   console.log('signout success');
    // }).catch(function(error) {
    //   // An error happened.
    //   console.log('signout error');
    // });
    firebase.auth().signOut()
    .then(() => {
        resolve('logout successful');
    }).catch((error) => {
        reject(error);
    });
  });
}
function addUserName(emailID, name){
  return new Promise(function(resolve, reject) {
    var email = emailID.replace(/\./g, ';');
    var emailRef = firebase.database().ref('users/' + email);
    emailRef.set({name: name, role: 'user'})
    .then(function(success) {
      console.log('success', success);
      resolve();
    })
    .catch(function(error) {
      reject(error);
    });
  });
}
function getProfileImage(email){
  return new Promise(function(resolve, reject) {
    var profileRef = firebase.storage().ref('profiles/' + email);
    profileRef.getDownloadURL().then(function(url) {
      console.log('success', url);
      resolve(url);
    })
    .catch(function(error) {
      reject(error);
    });
  });
}

function* logoutUserHandler(action) {
  try {
    yield call(logoutUser);
    yield put(userSessionActions.logoutUserSuccess());
    browserHistory.push('/');
  } catch (error) {
    yield put(userSessionActions.logoutUserError(error));
  }
}
function* addUserNameHandler(action) {
  try {
    yield call(addUserName, action.data.email, action.data.name);
  } catch (error) {
    console.log('ADD_USER_NAME ERROR:', error);
  }
}
function* getProfileImageHandler(action) {
  try {
    let data = yield call(getProfileImage, action.data.email);
    yield put(userSessionActions.fetchedProfileImage(data));
  } catch (error) {
    console.log('GET_PROFILE_IMAGE ERROR:', error);
    yield put(userSessionActions.profileImageError(error));
  }
}

export function* logoutUserListener() {
  yield* takeEvery('LOGOUT_USER', logoutUserHandler);
}
export function* addUserNameListener() {
  yield* takeEvery('ADD_USER_NAME', addUserNameHandler);
}
export function* getProfileImageListener() {
  yield* takeEvery('GET_PROFILE_IMAGE', getProfileImageHandler);
}

export default function* userSessionSagas() {
    yield fork(logoutUserListener);
    yield fork(addUserNameListener);
    yield fork(getProfileImageListener);
}
