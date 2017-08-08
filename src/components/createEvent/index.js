import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {get} from 'lodash';
import { browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Col} from 'react-bootstrap';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import {List, ListItem} from 'material-ui/List';
import {getQuestionBuckets, createEvent} from '../../actions/createEvent';

const customErrors = {
  name: null,
  date: null,
  time: null,
  duration: null,
  participants: null,
  questions: null
};

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {eventName: '', eventDate: '', eventTime: '', duration: 0, userName: '', userArray: [], showValidationErrors: false, questions: {}, time: null};
    this.goHome = this.goHome.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setTime = this.setTime.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.takeValue = this.takeValue.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleCreateEvent = this.handleCreateEvent.bind(this);
    this.setQuestion = this.setQuestion.bind(this);
  }
  componentDidMount() {
      console.log('at event creation');
      this.props.getQuestionBuckets();
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }
  goHome() {
    browserHistory.push('/myTest/');
  }
  handleChange(e, index, value) {
    console.log('handlechange', index, value);
    customErrors.name = null;
    this.setState({eventName: value});
  }
  setDate(e, date) {
    console.log('setDate', date, typeof (date));
    customErrors.date = null;
    this.setState({eventDate: date.toDateString()});;
  }
  setTime(e, time) {
    console.log('time', time, time + 90);
    customErrors.time = null;
    this.setState({time: time, eventTime: time.toLocaleTimeString()});
  }
  setDuration(e, duration) {
    customErrors.duration = null;
    this.setState({duration: e.target.value});
  }
  takeValue() {
      console.log('take value', this.state.userName);
      customErrors.participants = null;
      var showError = false;
      if (this.state.userName.trim() === '') {
        customErrors.participants = "* Please enter an email address";
        showError = true;
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.userName)) {
        customErrors.participants = "* Invalid email address";
        showError = true;
      }
      if (showError) {
        this.setState({showValidationErrors: true});
      } else {
        var userArray = this.state.userArray;
        userArray.push(this.state.userName);
        this.setState({userName: '', userArray: userArray});
      }
  }
  handleRequestDelete(index) {
    var userArray = this.state.userArray;
    userArray.splice(index, 1);
    this.setState({userArray: userArray});
  }
  handleCreateEvent() {
    this.setState({showValidationErrors: false});
    customErrors.name = null;
    customErrors.date = null;
    customErrors.time = null;
    customErrors.duration = null;
    customErrors.participants = null;
    customErrors.questions = null;

    var showError = false;

    if (this.state.eventName.trim() === '') {
      customErrors.name = "* Please select a name";
      showError = true;
    }
    if (this.state.eventDate.trim() === '') {
      customErrors.date = "* Please select a date";
      showError = true;
    }
    if (this.state.eventTime.trim() === '') {
      customErrors.time = "* Please select a time";
      showError = true;
    }
    if (this.state.duration === 0 || this.state.duration.trim() === '') {
      customErrors.duration = "* Please fill in the duration";
      showError = true;
    }
    if (Object.keys(this.state.questions).length === 0) {
      customErrors.questions = "* Please fill in no. of questions";
      showError = true;
    }
    if (showError) {
      this.setState({showValidationErrors: true});
    } else {
      var questionArray = [];
      for (var key in this.state.questions) {
        questionArray.push({category: key, quantity: this.state.questions[key]});
      }
      var fromDate = new Date(this.state.eventDate + ' ' + this.state.eventTime);
      var toTime = new Date(fromDate.getTime() + parseInt(this.state.duration, 10) * 60000);
      console.log('toTime', toTime);
      let data = {
        name: this.state.eventName,
        from: this.state.eventDate + ' ' + this.state.eventTime + ' ' + 'GMT+0530 (IST)',
        duration: parseInt(this.state.duration, 10),
        participants: this.state.userArray,
        questions: questionArray,
        to: toTime.toString()
      }
      console.log('save the event', data);
      this.props.createEvent(data);
    }
  }
  setQuestion(bucket, value) {
    var questions = this.state.questions;
    questions[bucket] = value;
    this.setState({questions: questions});
  }
  render() {
    console.log('!!! props ', this.props);
    return (
      <div className={"text-container"}>
        {
          false
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
                  <div style={{textAlign: 'left'}}>
                    <Col smOffset={4} sm={4}>
                        <SelectField
                        floatingLabelText="Event name"
                        floatingLabelStyle={{textAlign: 'left'}}
                        value={this.state.eventName}
                        onChange={this.handleChange}
                        >
                            <MenuItem value={'GFI Certification Exam'} primaryText="GFI Certification Exam" />
                            <MenuItem value={'CPT Certification Test'} primaryText="CPT Certification Test" />
                        </SelectField>
                    </Col>
                </div>
                {customErrors.name !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.name}</p> : ''}
                <div>
                   <Col smOffset={4} sm={4}>
                    <DatePicker hintText="Select Date" onChange={this.setDate}/>
                   </Col>
                </div> 
                {customErrors.date !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.date}</p> : ''}
                <div>
                   <Col smOffset={4} sm={4}>
                    <TimePicker
                    hintText="Select Time"
                    onChange={this.setTime}
                    />
                   </Col>
                </div>
                {customErrors.time !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.time}</p> : ''}
                <div>
                   <Col smOffset={4} sm={4}>
                    <TextField
                      floatingLabelText="Duration (in minutes)"
                      value={this.state.duration}
                      type={'number'}
                      onChange={this.setDuration}
                    />
                   </Col>
                </div>
                {customErrors.duration !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.duration}</p> : ''}
                <div className={"subHeading"}>
                   <Col smOffset={4} sm={4}>
                    <span>Add Participants</span>
                   </Col>
                </div>
                <div className={"subHeading"}>
                   <Col smOffset={4} sm={4}>
                    {
                      this.state.userArray.map((name, index) => {
                        return (
                          <Chip key={index} onRequestDelete={() => this.handleRequestDelete(index)} >
                            {name}
                          </Chip>
                        );
                      })
                    }
                   </Col>
                </div>
                <div>
                   <Col smOffset={4} sm={4} xs={12}>
                    <TextField
                      hintText="enter the participant name"
                      onChange={(e) => this.setState({userName: e.target.value})}
                      value={this.state.userName}
                      style={{paddingRight: '20px', zIndex: 1}}
                    />
                    <IconButton style={{position: 'absolute', right: '5px'}} onClick={this.takeValue}><ContentAddCircleOutline /></IconButton>
                   </Col>
                </div>
                {customErrors.participants !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.participants}</p> : ''}
                <div className={"subHeading"}>
                   <Col smOffset={4} sm={4}>
                    <span>Set questions</span>
                   </Col>
                </div>
                {customErrors.questions !== null && this.state.showValidationErrors ? <p className="text-danger">{customErrors.questions}</p> : ''}
                <div>
                  <Col smOffset={4} sm={4}>
                    <List>
                      {
                        get(this.props, 'questionBuckets', []).map((bucket, index) => {
                          return (
                            <ListItem key={index}>
                              <div className={"question-list"}>
                                <label>{bucket}</label>
                                <input type="number" className={'number-input'} onChange={(e) => this.setQuestion(bucket, e.target.value)}/>
                              </div>
                            </ListItem>
                          );
                        })
                      }
                    </List>
                  </Col>
                </div>
                <div>
                  <Col smOffset={4} sm={4}>
                    <RaisedButton label="Create Event" primary={true} className={'button'} 
                      disabled={this.state.submitting} onClick={this.handleCreateEvent}/>
                  </Col>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

CreateEvent.propTypes = {
  getQuestionBuckets: PropTypes.func,
  createEvent: PropTypes.func,
  questionBuckets: PropTypes.any
};

function mapToState(store) {
  return {
    user: store.userSession.user,
    questionBuckets: store.createEvent.questionBuckets,
    loading: store.createEvent.loading,
    createEventError: store.createEvent.createEventError
  };
}

function bindActions(dispatch){
  return {
    getQuestionBuckets: () => dispatch(getQuestionBuckets()),
    createEvent: (data) => dispatch(createEvent(data))
  };
}

export default connect(mapToState, bindActions)(CreateEvent);
