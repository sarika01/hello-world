import activeEventsSagas from './activeEvents';
import userEventsSagas from './userEvents';
import userSessionSagas from './userSession';
import createEventSagas from './createEvent';

function* rootSaga() {
  console.log('rootSaga', activeEventsSagas);
  yield [
    activeEventsSagas(),
    userEventsSagas(),
    userSessionSagas(),
    createEventSagas()
  ];
}
export default rootSaga;
