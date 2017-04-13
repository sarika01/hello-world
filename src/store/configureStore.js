import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {autoRehydrate} from 'redux-persist';
import rootSaga from '../sagas';
import rootReducer from '../reducers';
import createHelpers from './createHelpers';

export default function configureStore(initialState, helpersConfig) {
  const helpers = createHelpers(helpersConfig);
  console.log(helpers);
  //Custom middleware to handle route changes
  function routeMiddleware({dispatch, getState}) {
  return next =>
     action =>
       typeof action === 'function' ?
         action(dispatch, getState, helpers) :
         next(action);
  }
  //Custom Logging middleware
  const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState(), result);
    return result;
  };

  const sagaMiddleware = createSagaMiddleware();

  let enhancer;

//   if (__DEV__) {

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f;
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension();
    }

    enhancer = compose(
      applyMiddleware(sagaMiddleware,logger,routeMiddleware),
      autoRehydrate(),
      devToolsExtension,
    );
//   } else {
//     enhancer = compose(
//       applyMiddleware(sagaMiddleware, routeMiddleware),
//       autoRehydrate()
//     );
//   }

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);
  console.log('SAGA', rootSaga);
  sagaMiddleware.run(rootSaga);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
//   if (__DEV__ && module.hot) {
    // module.hot.accept('../reducers', () =>
    //   store.replaceReducer(require('../reducers').default) // eslint-disable-line global-require
    // );
//   }

  return store;
}
