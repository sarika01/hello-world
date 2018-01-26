import React, {Component} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import HomePage from '../homePage';
import ActiveOptionsPage from '../activeOptionsPage';
import ResultPage from '../resultPage';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import {logoutUser} from '../../actions/userSession';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import {getActiveEvents, getResults} from '../../actions/activeEvents';
import ProfilePage from '../profilePage';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {activeKey: 1, value: 'a', showMenu: false};
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  componentDidMount() {
    this.props.getActiveEvents({email: this.props.user.email});
  }
  handleTabSelect(e) {
    console.log('handleSelect', e);
    this.setState({activeKey: e});
  }
  handleChange = (value) => {
    if (value === 'a') {
      this.props.getActiveEvents({email: this.props.user.email});
    } else if (value === 'c') {
      this.props.getResults();
    }
    this.setState({
      value: value,
    });
  };
  showMenu() {
    this.setState({showMenu: true});
  }
  closeMenu(menuKey) {
    console.log('closeMenu', menuKey);
    if (menuKey) {
      switch (menuKey) {
        case 1:
          console.log('execute menukey 1');
          browserHistory.push('/myTest/createEvent');
          break;
        default:
        break;
      }
    }
    this.setState({showMenu: false});
  }
  render() {
    return (
      <div>
        <AppBar
          title=""
          iconElementLeft={
            this.props.role === 'admin'
            ?
            <IconButton onClick={this.showMenu}><ActionHome /></IconButton>
            :
            null
          }
          iconElementRight={<IconButton onClick={this.props.logoutUser}><ActionExitToApp /></IconButton>}
        />
        <Tabs value={this.state.value}
          onChange={this.handleChange}>
          <Tab label="Home" value={'a'}>
            {/* <HomePage /> */}
            <ActiveOptionsPage />
          </Tab>
          {/* <Tab label="Options" value={'b'} >
            <ActiveOptionsPage />
          </Tab> */}
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
        <Drawer docked={false} open={this.state.showMenu}
          onRequestChange={this.closeMenu}>
          <MenuItem onTouchTap={() => this.closeMenu(1)}>Create Event</MenuItem>
          <MenuItem onTouchTap={() => this.closeMenu(2)}>Menu Item 2</MenuItem>
        </Drawer>
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
