import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from './components/loginPage';
import './index.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import myReducers from './reducers';
import {Router, Route, browserHistory} from 'react-router';
import Dashboard from './components/dashboard';
import configureStore from './store/configureStore';
import createHistory from './core/createHistory';
import {useBasename} from 'history'; 
import {persistStore, storages} from 'redux-persist';
import * as firebase from 'firebase';
import EventDetails from './components/eventDetails';
import PlayEvent from './components/playEvent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {blueA400} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
var config = {
        apiKey: "AIzaSyBZD_yJsBw3W2upPDeqL_APEutNENcOP74",
        authDomain: "myloginproject-599d6.firebaseapp.com",
        databaseURL: "https://myloginproject-599d6.firebaseio.com",
        storageBucket: "myloginproject-599d6.appspot.com",
        messagingSenderId: "811919416479"
      };
      firebase.initializeApp(config);
      
let store1 = createStore(myReducers);
let initialState = store1.getState();

let existingUserData = JSON.parse(window.localStorage.getItem('reduxPersist:userSession'));
if (existingUserData !== null) {
  if ((new Date() - new Date(existingUserData.loggedInTime)) < 3600000) {
    initialState = {userSession: existingUserData};
  }
}
// const history = createHistory();
const useHistory = useBasename(createHistory)({
  basename: '#/'
});
const store = configureStore(initialState, {useHistory});
persistStore(store, {storage: storages.localStorage});
console.log('STORE', store, store.getState());
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blueA400,
  }
});
ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={LoginPage} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/event/:name' component={EventDetails} />
      <Route path='/playEvent/:name' component={PlayEvent} />
    </Router>
  </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
