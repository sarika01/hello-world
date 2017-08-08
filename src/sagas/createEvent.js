import * as createEventActions from '../actions/createEvent';
import {put, call, fork, takeEvery} from 'redux-saga/effects';
import * as firebase from 'firebase';
import _ from 'lodash';

function getQuestionBuckets(){
  return new Promise(function(resolve, reject) {
    var ref = firebase.database().ref('questionBank');
    ref.once('value').then(function(snapshot) {
        resolve(Object.keys(snapshot.val()));
    })
    .catch((error) => {
        reject(error);
    });
  });
}
function createEvent(data){
  return new Promise(function(resolve, reject) {
    var eventRef = firebase.database().ref('activeEvents');
    eventRef.once('value').then(function(snapshot) {
      var existingRecords = snapshot.val();
      data.event = 'event' + (Object.keys(existingRecords).length + 1);
      // existingRecords.push(data);
      eventRef.child(data.event).set(data)
      .then((success) => {
        resolve();
      })
      .catch((error) => {
        reject({message: 'Error in creating, try again!'});
      });

      // set pariticipants
      data.participants.map((participant, index) => {
        var userEmail = participant.replace(/\./g, ';');
        var userRef = firebase.database().ref('participants/' + userEmail);
        userRef.once('value').then(function(snapshot){
          if (snapshot.val() === null) {
            userRef.set([data.event]);
          } else {
            var userData = snapshot.val();
            userData[userData.length] = data.event;
            userRef.set(userData);
          }
        });
      });
    });
  });
}

function* getQuestionBucketsHandler(action) {
  try {
    let data = yield call(getQuestionBuckets);
    yield put(createEventActions.fetchedQuestionBuckets(data));
  } catch (error) {
      console.log('questionbucket error', error);
    yield put(createEventActions.getQuestionBucketsError());
  }
}
function* createEventHandler(action) {
  try {
    yield call(createEvent, action.data);
    yield put(createEventActions.createEventSuccess());
  } catch (error) {
    yield put(createEventActions.createEventFailed(error));
  }
}

export function* getQuestionBucketsListener() {
  yield takeEvery('GET_QUESTION_BUCKETS', getQuestionBucketsHandler);
}
export function* createEventListener() {
  yield takeEvery('CREATE_EVENT', createEventHandler);
}

export default function* createEventSagas() {
    yield fork(getQuestionBucketsListener);
    yield fork(createEventListener);
}
