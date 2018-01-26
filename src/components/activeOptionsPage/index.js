import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {getActiveEvents} from '../../actions/activeEvents';
import { browserHistory } from 'react-router'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionDone from 'material-ui/svg-icons/action/done';

class ActiveOptionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (this.props.user && this.props.user.email) {
      this.props.getActiveEvents({email: this.props.user.email});
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user.email && !this.props.user.email) {
      this.props.getActiveEvents({email: nextProps.user.email});
    }
  }
  loadEvent(eventName) {
    browserHistory.push('/myTest/event/' + eventName);
  }
  render() {
    var self = this;
    console.log('!@#!@#', this.props.activeEvents, typeof(this.props.activeEvents));
    /*let activeEventsToDisplay = this.props.activeEvents &&
      this.props.activeEvents.map(function(userEvent, index) {
        var duration = userEvent.duration * 60000;
        console.log(userEvent.name, duration, new Date() - new Date(userEvent.from));
        var dateDiff = new Date() - new Date(userEvent.from);
        if (dateDiff > 0 && dateDiff < duration) {
          return (
            <p key={index}>
              <button className={"start-btn"} onClick={self.loadEvent.bind(self, userEvent.name)}>{userEvent.name}</button>
              <br />
              <span>{'Started at ' + userEvent.from}</span>
            </p>
          );
        } else if (dateDiff < 0) {
          return (
            <p key={index}>
              <span>{userEvent.name + ' - scheduled on ' + userEvent.from}</span>
            </p>
          );
        } else {
          return (
            <p key={index}>
              <span>{userEvent.name + ' - was held at ' + userEvent.from}</span>
            </p>
          );
        }
      });*/
      let activeEventsToDisplay = this.props.activeEvents &&
      this.props.activeEvents.map(function(userEvent, index) {
        if (userEvent) {
          var duration = userEvent.duration * 60000;
          console.log(userEvent.name, duration, new Date() - new Date(userEvent.from));
          var dateDiff = new Date() - new Date(userEvent.from);
          if (dateDiff > 0 && dateDiff < duration) {
            return (
              <div key={index}>
                <ListItem primaryText={userEvent.name} rightIcon={<NavigationChevronRight />} onTouchTap={self.loadEvent.bind(self, userEvent.event)} />
                <Divider />
              </div>
            );
          } else if (dateDiff < 0) {
            return (
              <div key={index}>
                <ListItem primaryText={userEvent.name}/>
                <Divider />
              </div>
            );
          } else {
            return (
              <div key={index}>
                <ListItem primaryText={userEvent.name} leftIcon={<ActionDone />}/>
                <Divider />
              </div>
            );
          }
        }
      });
    /*return (
      <div className={'box-container'}>
          <div className={"text-container"}>
            {activeEventsToDisplay}
            {
              this.props.activeEventsError
              ?
              <p className={"desc-text"}>{this.props.errorMessage}</p>
              :
              null
            }
        </div>
      </div>
    );*/
    return (
       <Paper zDepth={2} style={{margin: '12px'}}>
          <List>
            {activeEventsToDisplay}
          </List>
          {
            this.props.activeEventsError
            ?
            <p className={"desc-text"}>{this.props.errorMessage}</p>
            :
            null
          }
      </Paper>
    );
  }
}

ActiveOptionsPage.propTypes = {
  getActiveEvents: PropTypes.func,
  activeEvents: PropTypes.any,
  activeEventsError: PropTypes.bool,
  errorMessage: PropTypes.string
};

function mapToState(store) {
  return {
    activeEvents: store.activeEvents.activeEvents,
    user: store.userSession.user,
    activeEventsError: store.activeEvents.activeEventsError,
    errorMessage: store.activeEvents.errorMessage
  };
}

function bindActions(dispatch){
  return {
      getActiveEvents: (data) => dispatch(getActiveEvents(data))
  };
}

export default connect(mapToState, bindActions)(ActiveOptionsPage);
