import React, {Component} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {getEventDetails} from '../../actions/activeEvents';
import {get} from 'lodash';
import { browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Col} from 'react-bootstrap';

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.startEvent = this.startEvent.bind(this);
    this.goHome = this.goHome.bind(this);
  }
  componentDidMount() {
      console.log('at event details', this.props);
      this.props.getEventDetails({name: this.props.eventName, email: this.props.user.email});
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }
  startEvent() {
    browserHistory.push('/playEvent/' + this.props.eventName);
  }
  goHome() {
    browserHistory.push('/');
  }
  render() {
    console.log('details!!!', this.props);
    return (
      <div className={"text-container"}>
        {
          this.props.loading
          ?
          <p className={"desc-text"}>Loading ...</p>
          :
            this.props.eventDetailsError
            ?
            <p className={"desc-text"}>{this.props.eventDetailsError.message}</p>
            :
            <div>
              <AppBar
                title="Title"
                iconElementLeft={<IconButton onClick={this.goHome}><ActionHome /></IconButton>}
              />
              <div className={'box-container'}>
                <p className={'header-text'}>{get(this.props, 'eventDetails.name', null)}</p>
                <p className={'success-message'}>{'Duration: ' + get(this.props, 'eventDetails.duration', null) + ' minutes'}</p>
                <p className={'success-message'}>{Math.round((new Date() - new Date(get(this.props, 'eventDetails.from', null)))/60000)} {'minutes have elapsed'}</p>
                <div>
                  <Col smOffset={4} sm={4}>
                    <RaisedButton label="Start" primary={true} className={'button'} 
                       onClick={this.startEvent}/>
                  </Col>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

EventDetails.propTypes = {
  
};

function mapToState(store) {
  return {
    user: store.userSession.user,
    eventDetails: store.activeEvents.eventDetails,
    loading: store.activeEvents.loading,
    eventDetailsError: store.activeEvents.eventDetailsError
  };
}

function bindActions(dispatch){
  return {
    getEventDetails: (data) => dispatch(getEventDetails(data))
  };
}

export default connect(mapToState, bindActions)(EventDetails);
