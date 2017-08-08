import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {getUserEvent, registerAnswer, getUserScore, resetUserEvent} from '../../actions/userEvents';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import AppBar from 'material-ui/AppBar';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';

class PlayEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.registerAnswer = this.registerAnswer.bind(this);
    this.getScore = this.getScore.bind(this);
    this.goHome = this.goHome.bind(this);
  }
  componentDidMount() {
      console.log('at event details', this.props);
      this.props.getUserEvent({name: this.props.eventName, email: this.props.user.email});
  }
  registerAnswer(selection, question) {
    console.log('selected!!', selection);
    this.props.registerAnswer({question, selection, email: this.props.user.email, name: this.props.eventName});
  }
  getScore() {
    if (this.props.userEvent && this.props.userEvent.questionSet) {
      var remaining = _.findIndex(this.props.userEvent.questionSet, function(question, index) {
        return typeof (question.userAnswer) === 'undefined';
      });
      if (remaining === -1) {
        this.props.getUserScore({name: this.props.eventName, email: this.props.user.email});
      }
    }
  }
  goHome() {
    browserHistory.push('/myTest/');
  }
  render() {
    var self = this;
    var nextQuestion = function() {
      if (self.props.userEvent && self.props.userEvent.questionSet) {
        for (var i = 0; i < self.props.userEvent.questionSet.length; i++) {
          var questionObj = self.props.userEvent.questionSet[i];
          if (typeof (questionObj.userAnswer) === 'undefined') {
            return (
              <div>
                <p className={'question-text'}>{'Q' + (i + 1) + ': ' + questionObj.question}</p>
                <p className={'m-a-10'}>
                <button className={'btn-option'} disabled={self.props.updating} onClick={() => self.registerAnswer(0, i)}>{questionObj.options[0]}</button>
                </p>
                <p className={'m-a-10'}>
                <button className={'btn-option'} disabled={self.props.updating} onClick={() => self.registerAnswer(1, i)}>{questionObj.options[1]}</button>
                </p>
                <p className={'m-a-10'}>
                <button className={'btn-option'} disabled={self.props.updating} onClick={() => self.registerAnswer(2, i)}>{questionObj.options[2]}</button>
                </p>
                <p className={'m-a-10'}>
                <button className={'btn-option'} disabled={self.props.updating} onClick={() => self.registerAnswer(3, i)}>{questionObj.options[3]}</button>
                </p>
              </div>
            );
          }
        }
        if (self.props.userScore && self.props.userScore !== null) {
          return (
            <div>
              <p className={'success-message'}>You have successfully completed the questionaire!</p>
            </div>
          );
        } else {
          return (
            <div>
              <p className={'success-message'}>The questionaire has ended.</p>
              <button className={"start-btn"} onClick={self.getScore}>SUBMIT</button>
            </div>
          );
        }
      } else {
        return null;
      }
    };

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
                {this.props.userEvent && nextQuestion()}
              </div>
            </div>
        }
      </div>
    );
  }
}

PlayEvent.propTypes = {
  user: PropTypes.any,
  userEvent: PropTypes.object,
  loading: PropTypes.bool,
  userEventError: PropTypes.any,
  getUserEvent: PropTypes.func,
  registerAnswer: PropTypes.func,
  getUserScore: PropTypes.func,
  updating: PropTypes.bool,
  updatingError: PropTypes.any
};

function mapToState(store) {
  return {
    user: store.userSession.user,
    userEvent: store.userEvents.userEvent,
    loading: store.userEvents.loading,
    userEventError: store.userEvents.userEventError,
    updating: store.userEvents.updating,
    updatingError: store.userEvents.updatingError,
    userScore: store.userEvents.userScore,
    userScoreError: store.userEvents.userScoreError,
    resetUserEvent: PropTypes.func
  };
}

function bindActions(dispatch){
  return {
    getUserEvent: (data) => dispatch(getUserEvent(data)),
    registerAnswer: (data) => dispatch(registerAnswer(data)),
    getUserScore: (data) => dispatch(getUserScore(data)),
    resetUserEvent: () => dispatch(resetUserEvent())
  };
}

export default connect(mapToState, bindActions)(PlayEvent);
