import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {Tabs, Tab} from 'react-bootstrap';
import './styles.css';
import HomePage from '../homePage';
import ActiveOptionsPage from '../activeOptionsPage';
import ResultPage from '../resultPage';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {logoutUser} from '../../actions/userSession';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import {getActiveEvents, getResults} from '../../actions/activeEvents';
import ProfilePage from '../profilePage';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {activeKey: 1, value: 'a'};
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }
  handleTabSelect(e) {
    console.log('handleSelect', e);
    this.setState({activeKey: e});
  }
  handleChange = (value) => {
    if (value === 'b') {
      this.props.getActiveEvents({email: this.props.user.email});
    } else if (value === 'c') {
      this.props.getResults();
    }
    this.setState({
      value: value,
    });
  };
  render() {
    return (
      <div>
        <AppBar
          title="Title"
          iconElementLeft={<IconButton><ActionHome /></IconButton>}
          iconElementRight={<IconButton onClick={this.props.logoutUser}><ActionExitToApp /></IconButton>}
        />
        <Tabs value={this.state.value}
          onChange={this.handleChange}>
          <Tab label="Home" value={'a'}>
            <HomePage />
          </Tab>
          <Tab label="Options" value={'b'} >
            <ActiveOptionsPage />
          </Tab>
          {
            this.props.role === 'admin'
            ?
            <Tab
              label="results"
              value={'c'}
            >
              <ResultPage/>
            </Tab>
            :
            null
          }
          <Tab label="Profile" value={'d'} >
            <ProfilePage />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Dashboard.propTypes = {
  
};

function mapToState(store) {
  return {
    role: store.userSession.role,
    user: store.userSession.user
  };
}

function bindActions(dispatch){
  return {
    logoutUser: () => dispatch(logoutUser()),
    getActiveEvents: (data) => dispatch(getActiveEvents(data)),
    getResults: () => dispatch(getResults())
  };
}

export default connect(mapToState, bindActions)(Dashboard);
