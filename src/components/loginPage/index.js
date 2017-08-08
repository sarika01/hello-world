import React, { Component } from 'react';
import './styles.css';
import {Col, Row} from 'react-bootstrap';
import * as firebase from 'firebase';
import {setUser, loginError, registerError, addUserName, getProfileImage} from '../../actions/userSession';
import {connect} from 'react-redux';
import {navigate} from '../../actions/route';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const customErrors = {
  email: null,
  passwd: null,
  errorMsg: null
};
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      email: '',
      passwd: '',
      repasswd: '',
      showValidationErrors: false,
      registerUser: false,
      userName: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.showRegistration = this.showRegistration.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }
  componentDidMount() {
      if (this.props.loggedInStatus) {
        browserHistory.push('/myTest/dashboard');
      }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.loggedInStatus) {
        browserHistory.push('/myTest/dashboard');
      }
  }
  handleLogin() {
    customErrors.email = null;
    customErrors.passwd = null;
    customErrors.errorMsg = null;
    this.setState({submitting: true});
    if (this.state.email.trim() === '') {
      customErrors.email = "* Please enter an email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
      customErrors.email = "* Invalid email address";
    }
    if (this.state.passwd.trim() === '') {
      customErrors.passwd = "* Please enter your password";
    }
    if (customErrors.email === null && customErrors.passwd === null) {
      var self = this;
      firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.passwd.trim())
      .then(function(result) {
        var email = self.state.email.trim().replace(/\./g, ';');
        var emailRef = firebase.database().ref('users/' + email);
        emailRef.once('value').then(function(snapshot) {
          if (snapshot.val() !== null) {
            var user = snapshot.val();
            self.props.setUser({data: result, name: user.name, role: user.role});
          } else {
            self.props.setUser({data: result, name: '', role: 'user'});
          }
        });
        self.props.getProfileImage({email: email});
        // setTimeout(function() {
        //   // self.props.navigate('/dashboard');
        //   browserHistory.push('/myExam/dashboard');
        // }, 500);
      })
      .catch(function(error) {
        self.props.loginError({});
        if (error.message) {
          customErrors.errorMsg = error.message;
        } else {
          customErrors.errorMsg = "Error in logging in";
        }
        self.setState({showValidationErrors: true, submitting: false});
      });
    } else {
      this.setState({showValidationErrors: true, submitting: false});
    }
  }
  showRegistration() {
    this.setState({registerUser: true, showValidationErrors: false, submitting: false, email: '', passwd: ''})
  }
  handleRegister() {
    customErrors.name = null;
    customErrors.email = null;
    customErrors.passwd = null;
    customErrors.errorMsg = null;
    this.setState({submitting: true});
    if (this.state.userName.trim() === '') {
      customErrors.name = "* Please enter your name";
    } else if (!/^[a-z A-Z\u00C0-\u00ff]+$/.test(this.state.userName)) {
      customErrors.name = "* name can have only alphabets";
    }
    if (this.state.email.trim() === '') {
      customErrors.email = "* Please enter an email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
      customErrors.email = "* Invalid email address";
    }
    if (this.state.passwd.trim() === '' || this.state.repasswd.trim() === '') {
      customErrors.passwd = "* Please enter a password";
    } else if (this.state.passwd !== this.state.repasswd) {
      customErrors.passwd = "* Your passwords do not match";
    } else if (this.state.passwd.trim().length < 6) {
      customErrors.passwd = "* Password should be min. 6 characters";
    }
    if (customErrors.name === null && customErrors.email === null && customErrors.passwd === null) {
      var self = this;
      firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.passwd.trim())
      .then(function(result) {
        self.props.setUser({data: result, username: self.state.userName, role: 'user'});
        self.props.addUserName({name: self.state.userName, email: self.state.email.trim()});
        // setTimeout(function() {
        //   browserHistory.push('/myExam/dashboard');
        // }, 500);
      })
      .catch(function(error) {
        self.props.registerError({});
        if (error.message) {
          customErrors.errorMsg = error.message;
        } else {
          customErrors.errorMsg = "Error in registering";
        }
        self.setState({showValidationErrors: true, submitting: false});
      });
    } else {
      this.setState({showValidationErrors: true, submitting: false});
    }
  }
  handleNext() {
    customErrors.email = null;
    this.setState({submitting: true});
    if (this.state.email.trim() === '') {
      customErrors.email = "* Please enter an email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
      customErrors.email = "* Invalid email address";
    }
    if (customErrors.email === null) {
      this.setState({showNext: true, submitting: false});
    } else {
      this.setState({showValidationErrors: true, submitting: false});
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header" style={{display: 'none'}}>
          <img src={'/myTest/certifyMe.png'} className={'App-logo'} alt={''}/>
          <p className={'banner-text'}>All tests. One account.</p>
        </div>
        {
          this.state.registerUser
          ?
          <div className={'box-container'}>
            <div>
              <Col smOffset={4} sm={4}>
              <TextField
                  hintText="enter your full name"
                  floatingLabelText="Name"
                  value={this.state.userName}
                  onChange={(e) => this.setState({userName: e.target.value, showValidationErrors: false})}
                /><br />
              </Col>
            </div>
            {customErrors.name !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.name}</span> : ''}
            <div>
              <Col smOffset={4} sm={4}>
              <TextField
                  hintText="enter you email address"
                  floatingLabelText="Email"
                  value={this.state.email}
                  onChange={(e) => this.setState({email: e.target.value, showValidationErrors: false})}
                /><br />
              </Col>
            </div>
            {customErrors.email !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.email}</span> : ''}
            <div>
              <Col smOffset={4} sm={4}>
              <TextField
                  hintText=""
                  floatingLabelText="Password"
                  type={"password"}
                  value={this.state.passwd}
                  onChange={(e) => this.setState({passwd: e.target.value, showValidationErrors: false})}
                /><br />
              </Col>
            </div>
            <div>
              <Col smOffset={4} sm={4}>
              <TextField
                  hintText="enter password again"
                  floatingLabelText="Re-enter password"
                  type={"password"}
                  value={this.state.repasswd}
                  onChange={(e) => this.setState({repasswd: e.target.value, showValidationErrors: false})}
                /><br />
              </Col>
            </div>
            {customErrors.passwd !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.passwd}</span> : ''}
            <div>
              <Col smOffset={4} sm={4}>
                <RaisedButton label="Create" primary={true} className={'button'} 
                  disabled={this.state.submitting} onClick={this.handleRegister}/>
              </Col>
            </div>
            <div className={'m-t-5'}>
              <Col smOffset={4} sm={4}>
                {customErrors.errorMsg !== null && this.state.showValidationErrors ? <span className="error-text">{customErrors.errorMsg}</span> : ''}
              </Col>
            </div>
          </div>
          :
          <div className={'box-container'}>
            <Row>
              <Col smOffset={4} sm={4}>
                <p className="App-intro">
                  <img src={'/myTest/profile-icon-9.png'} className={'login-logo'} alt={''}/>
                </p>
              </Col>
            </Row>
            {
              !this.state.showNext
              ?
              <div>
                <div>
                  <Col smOffset={4} sm={4}>
                  <TextField
                      hintText="enter you email address"
                      floatingLabelText="Email"
                      value={this.state.email}
                      onChange={(e) => this.setState({email: e.target.value, showValidationErrors: false})}
                    /><br />
                  </Col>
                </div>
                {customErrors.email !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.email}</span> : ''}
                <div>
                  <Col smOffset={4} sm={4}>
                    <RaisedButton label="Next >" primary={true} className={'button'} 
                      disabled={this.state.submitting} onClick={this.handleNext}/>
                  </Col>
                </div>
                <div>
                  <Col smOffset={4} sm={4}>
                    <FlatButton label="Create account" primary={true} className={'link-btn'}
                      disabled={this.state.submitting} onClick={this.showRegistration}/>
                  </Col>
                </div>
              </div>
              :
              <div>
                <p className={'font-15'}>{this.state.email}</p>
                <div>
                  <Col smOffset={4} sm={4}>
                  <TextField
                      hintText=""
                      floatingLabelText="Password"
                      type={"password"}
                      value={this.state.passwd}
                      onChange={(e) => this.setState({passwd: e.target.value, showValidationErrors: false})}
                    /><br />
                  </Col>
                </div>
                {customErrors.passwd !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.passwd}</span> : ''}
                <div>
                  <Col smOffset={4} sm={4}>
                    <RaisedButton label="Continue" primary={true} className={'button'} 
                      disabled={this.state.submitting} onClick={this.handleLogin}/>
                  </Col>
                </div>
                <div className={'m-t-5'}>
                  <Col smOffset={4} sm={4}>
                    {customErrors.errorMsg !== null && this.state.showValidationErrors ? <span className="error-text">{customErrors.errorMsg}</span> : ''}
                  </Col>
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

function mapToState(store) {
  return {
    loginError: store.userSession.loginError,
    registerError: store.userSession.registerError,
    errorMessage: store.userSession.errorMessage,
    loggedInStatus: store.userSession.loggedInStatus,
    user: store.userSession.user
  };
}
function bindActions(dispatch) {
  return {
    setUser: (data) => dispatch(setUser(data)),
    loginError: (data) => dispatch(loginError(data)),
    registerError: (data) => dispatch(registerError(data)),
    navigate: (data) => dispatch(navigate(data)),
    addUserName: (data) => dispatch(addUserName(data)),
    getProfileImage: (data) => dispatch(getProfileImage(data))
  };
}
export default connect(mapToState, bindActions)(LoginPage);
