import activeEventsSagas from './activeEvents';
import userEventsSagas from './userEvents';
import userSessionSagas from './userSession';

function* rootSaga() {
  console.log('rootSaga', activeEventsSagas);
  yield [
    activeEventsSagas(),
    userEventsSagas(),
    userSessionSagas()
  ];
}
export default rootSaga;
