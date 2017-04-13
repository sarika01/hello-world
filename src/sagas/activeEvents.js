import * as activeEventsActions from '../actions/activeEvents';
import {put, call, fork} from 'redux-saga/effects';
import {takeEvery} from 'redux-saga';
import * as firebase from 'firebase';
import _ from 'lodash';

function getActiveEvents(emailID){
  return new Promise(function(resolve, reject) {
    var database = firebase.database();
    var email = emailID.replace(/\./g, ';');
    var emailRef = firebase.database().ref('participants/' + email);
    emailRef.once('value').then(function(snapshot) {
      if (snapshot.val() === null) {
        reject({message: "no events to display"});
      } else {
        Promise.all(
          snapshot.val().map((event, index) => {
            var eventKey = firebase.database().ref('activeEvents/' + event);
            return eventKey.once('value').then(function(childSnapshot) {
              var obj = childSnapshot.val();
              obj.event = event;
              return obj;
            });
          })
        ).then((result) => {
          resolve(result);
        }).catch((error) => {
          reject(error);
        });
      }
    });
  });
}
function getEventDetails(name, email){
  return new Promise(function(resolve, reject) {
    // var database = firebase.database();
    var eventRef = firebase.database().ref('activeEvents/' + name);
    eventRef.once('value').then(function(snapshot) {
      let data = snapshot.val();
      var index = _.find(data.participants, function(value){ return value === email;});
      if (!index) {
        reject({message: "You are not authorized to view this"});
      } else {
        var duration = data.duration * 60000;
        var dateDiff = new Date() - new Date(data.from);
        if (dateDiff > 0 && dateDiff < duration) {
          resolve(data);
        } else if (dateDiff < 0) {
          reject({message: "This event has not yet started"});
        } else {
          reject({message: "This event has expired"});
        }
      }
    });
  });
}
function getResults(){
  return new Promise(function(resolve, reject) {
    let resultsArray = [];
    var eventRef = firebase.database().ref('results');
    eventRef.once('value').then(function(snapshot) {
      if (snapshot.val() === null) {
        reject({message: "no events to display"});
      } else {
        var data = snapshot.val();
        var userKey = firebase.database().ref('users');
        userKey.once('value').then(function(childSnapshot) {
          var childData = childSnapshot.val();
          for(var propertyName in data) {
            for (var eventName in data[propertyName]){
              var obj = {
                email: propertyName.replace(/\;/g, '.'),
                result: data[propertyName][eventName],
                info: childData[propertyName]
                // result: data[propertyName],
                // info: childData[propertyName]
              };
              resultsArray.push(obj);
              break;
            }
          };
          console.log('!!!', resultsArray);
          resolve(resultsArray);
        });
      }
    }).catch((error) => {
      reject(error);
    });;
  });
}

function* getActiveEventsHandler(action) {
  try {
    let data = yield call(getActiveEvents, action.data.email);
    yield put(activeEventsActions.fetchedActiveEvents(data));
  } catch (error) {
    yield put(activeEventsActions.failedActiveEvents(error));
  }
}
function* getEventDetailsHandler(action) {
  try {
    let data = yield call(getEventDetails, action.data.name, action.data.email);
    yield put(activeEventsActions.fetchedEventDetails(data));
  } catch (error) {
    yield put(activeEventsActions.eventDetailsError(error));
  }
}
function* getResultsHandler(action) {
  try {
    let data = yield call(getResults);
    yield put(activeEventsActions.getResultsSuccess(data));
  } catch (error) {
    yield put(activeEventsActions.getResultsFailed(error));
  }
}

export function* getActiveEventsListener() {
  yield* takeEvery('GET_ACTIVE_EVENTS', getActiveEventsHandler);
}
export function* getEventDetailsListener() {
  yield* takeEvery('GET_EVENT_DETAILS', getEventDetailsHandler);
}
export function* getResultsListener() {
  yield* takeEvery('GET_RESULTS', getResultsHandler);
}

export default function* activeEventsSagas() {
    yield fork(getActiveEventsListener);
    yield fork(getEventDetailsListener);
    yield fork(getResultsListener);
}
