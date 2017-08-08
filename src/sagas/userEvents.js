import * as userEventsActions from '../actions/userEvents';
import {put, call, fork, takeEvery} from 'redux-saga/effects';
import * as firebase from 'firebase';
import _ from 'lodash';

function getUserEvent(emailID, name){
  return new Promise(function(resolve, reject) {
    var email = emailID.replace(/\./g, ';');
    var emailRef = firebase.database().ref('userSessions/' + email).child(name);
    emailRef.once('value').then(function(snapshot) {
      if (snapshot.val() === null) {
        // create new session
        var eventRef = firebase.database().ref('activeEvents/' + name);
        eventRef.once('value').then(function(snapshot) {
          let userEvent = snapshot.val();
          console.log('user event', userEvent);
          if (userEvent === null) {
            reject({message: "Invalid or expired event"});
          } else {
            Promise.all(
              userEvent.questions.map((categoryObj, index) => {
                var categoryKey = firebase.database().ref('questionBank/' + categoryObj.category);
                return categoryKey.once('value').then(function(childSnapshot) {
                  var obj = childSnapshot.val();
                  var obj1 = _.shuffle(obj);
                  var count = categoryObj.quantity;
                  var returnArray = [];
                  for (var i = 0; i < count; i++) {
                    if (!obj1[i]) {
                      count++;
                    } else {
                      returnArray.push(obj1[i]);
                    }
                  }
                  return returnArray;
                });
              })
            ).then((result) => {
              var finalArray = _.flatten(result);
              var sessionRef = firebase.database().ref('userSessions/' + email).child(name);
              sessionRef.set({
                questionSet: finalArray,
              })
              .then(function(success) {
                console.log('success', success);
                resolve({questionSet: finalArray});
              })
              .catch(function(error) {
                reject({message: 'Error in starting event'});
              });
              
            }).catch((error) => {
              reject(error);
            });
          }
        });
      } else {
        // return saved session

        resolve(snapshot.val());
      }
    });
  });
}
function getUserScore(emailID, name){
  return new Promise(function(resolve, reject) {
    var email = emailID.replace(/\./g, ';');
    var emailRef = firebase.database().ref('userSessions/' + email).child(name);
    emailRef.once('value').then(function(snapshot) {
      var data = snapshot.val();
      var totalCount = data.questionSet.length;
      var userScore = 0;
      for (var i = 0; i < totalCount; i++) {
        if (data.questionSet[i].answer === data.questionSet[i].userAnswer) {
          userScore++;
        }
      }
      var result = {
        event: name,
        score: userScore,
        total: totalCount
      };
      var userRef = firebase.database().ref('results/' + email).child(name);
      userRef.once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          userRef.set(result)
          .then((success) => {
            resolve(result);
          })
          .catch((error) => {
            reject({message: 'Error in generating score'});
          });
        } else {
          console.log('!!!', snapshot.val());
          // var resultData = snapshot.val();
          if (snapshot.val() === null) {
            userRef.set(result)
            .then((success) => {
              resolve(result);
            })
            .catch((error) => {
              reject({message: 'Error in generating score'});
            });
          } else {
            resolve(snapshot.val());
          }
        }
      });
    });
  });
}
function registerAnswer(question, selection, emailID, name) {
  return new Promise(function(resolve, reject) {
    var email = emailID.replace(/\./g, ';');
    var emailRef = firebase.database().ref('userSessions/' + email).child(name);
    emailRef.once('value').then(function(snapshot) {
      var userSession = snapshot.val();
      if (userSession === null) {
        reject({message: "Your session has ended!"});
      } else {
        console.log('userSession', userSession);
        userSession.questionSet[question].userAnswer = selection;
        emailRef.set(userSession)
        .then((success) => {
          resolve(userSession);
        })
        .catch((error) => {
          reject({message: 'Error in updating, try again!'});
        });
      }
    });
  });
}

function* getUserEventHandler(action) {
  try {
    let data = yield call(getUserEvent, action.data.email, action.data.name);
    yield put(userEventsActions.fetchedUserEvent(data));
  } catch (error) {
    yield put(userEventsActions.failedUserEvent());
  }
}
function* getUserScoreHandler(action) {
  try {
    let data = yield call(getUserScore, action.data.email, action.data.name);
    yield put(userEventsActions.fetchedUserScore(data));
  } catch (error) {
    yield put(userEventsActions.userScoreError(error));
  }
}
function* registerAnswerHandler(action) {
  try {
    let data = yield call(registerAnswer, action.data.question, action.data.selection, action.data.email, action.data.name);
    yield put(userEventsActions.registerAnswerSuccess(data));
  } catch (error) {
    yield put(userEventsActions.registerAnswerFailed(error));
  }
}

export function* getUserEventListener() {
  yield takeEvery('GET_USER_EVENT', getUserEventHandler);
}
export function* getUserScoreListener() {
  yield takeEvery('GET_USER_SCORE', getUserScoreHandler);
}
export function* registerAnswerListener() {
  yield takeEvery('REGISTER_ANSWER', registerAnswerHandler);
}

export default function* userEventsSagas() {
    yield fork(getUserEventListener);
    yield fork(getUserScoreListener);
    yield fork(registerAnswerListener);
}
