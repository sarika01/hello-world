import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {FormGroup, FormControl, ControlLabel, Form, Col, Button, Row} from 'react-bootstrap';
import * as firebase from 'firebase';
import {setUser, loginError, registerError} from './actions/userSession';
import {connect} from 'react-redux';
import {navigate} from './actions/route';
import { browserHistory } from 'react-router'


const customErrors = {
  email: null,
  passwd: null,
  errorMsg: null
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      email: '',
      passwd: '',
      repasswd: '',
      showValidationErrors: false,
      registerUser: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.showRegistration = this.showRegistration.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  componentDidMount() {
      if (this.props.loggedInStatus) {
        browserHistory.push('/test/dashboard');
      }
  }
  componentWillReceiveProps (nextProps) {
    console.log('!!!', nextProps.loggedInStatus);
    // if ((nextProps.loginError && !this.props.loginError) || (nextProps.registerError && !this.props.registerError) {
      
    // }
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
        self.props.setUser(result);
        setTimeout(function() {
          // self.props.navigate('/dashboard');
          browserHistory.push('/test/dashboard');
        }, 500);
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
    customErrors.email = null;
    customErrors.passwd = null;
    customErrors.errorMsg = null;
    this.setState({submitting: true});
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
    if (customErrors.email === null && customErrors.passwd === null) {
      var self = this;
      firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.passwd.trim())
      .then(function(result) {
        self.props.setUser(result);
        setTimeout(function() {
          browserHistory.push('/test/dashboard');
        }, 500);
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
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Col sm={2}>
          <img src={logo} className="App-logo" alt="logo" />
          </Col>
          <Col sm={8}>
            <h2>Welcome to React</h2>
          </Col>
        </div>
        {
          this.state.registerUser
          ?
          <div>
            <Row>
              <Col smOffset={5} sm={2}>
                <p className="App-intro">
                  <span>Register to the app!</span>
                </p>
              </Col>
            </Row>
            <Form horizontal>
              <FormGroup className="form-field">
                <Col componentClass={ControlLabel} smOffset={3} sm={2}>Email Address:</Col>
                <Col sm={4}>
                  <FormControl
                      type="email"
                      placeholder={'enter your email address'}
                      value={this.state.email}
                      onChange={(e) => this.setState({email: e.target.value, showValidationErrors: false})}
                    />
                </Col>
                {customErrors.email !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.email}</span> : ''}
              </FormGroup>
              <FormGroup className="form-field">
                <Col componentClass={ControlLabel} smOffset={3} sm={2}>Password:</Col>
                <Col sm={4}>
                  <FormControl
                      type="password"
                      placeholder={'enter password'}
                      value={this.state.passwd}
                      onChange={(e) => this.setState({passwd: e.target.value, showValidationErrors: false})}
                    />
                </Col>
              </FormGroup>
              <FormGroup className="form-field">
                <Col componentClass={ControlLabel} smOffset={3} sm={2}>Re-enter Password:</Col>
                <Col sm={4}>
                  <FormControl
                      type="password"
                      placeholder={'enter password again'}
                      value={this.state.repasswd}
                      onChange={(e) => this.setState({repasswd: e.target.value, showValidationErrors: false})}
                    />
                </Col>
                {customErrors.passwd !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.passwd}</span> : ''}
              </FormGroup>
              <FormGroup>
                <Col smOffset={5} sm={4}>
                  <Button className={'submit-btn'} disabled={this.state.submitting} onClick={this.handleRegister}>
                    REGISTER
                  </Button>
                </Col>
              {customErrors.errorMsg !== null && this.state.showValidationErrors ? <span className="error-text">{customErrors.errorMsg}</span> : ''}
              </FormGroup>
            </Form>
          </div>
          :
          <div>
            <Row>
              <Col smOffset={4} sm={4}>
                <p className="App-intro">
                  <span>Please login to get started!</span>
                </p>
              </Col>
            </Row>
            <Form horizontal>
              <FormGroup className="form-field">
                <Col componentClass={ControlLabel} smOffset={3} sm={2}>Email Address:</Col>
                <Col sm={4}>
                  <FormControl
                      type="email"
                      placeholder={'enter your email address'}
                      value={this.state.email}
                      onChange={(e) => this.setState({email: e.target.value, showValidationErrors: false})}
                    />
                </Col>
                {customErrors.email !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.email}</span> : ''}
              </FormGroup>
              <FormGroup className="form-field">
                <Col componentClass={ControlLabel} smOffset={3} sm={2}>Password:</Col>
                <Col sm={4}>
                  <FormControl
                      type="password"
                      placeholder={'enter password'}
                      value={this.state.passwd}
                      onChange={(e) => this.setState({passwd: e.target.value, showValidationErrors: false})}
                    />
                </Col>
                {customErrors.passwd !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.passwd}</span> : ''}
              </FormGroup>
              <FormGroup>
                <Col smOffset={5} sm={4}>
                  <Button className={'submit-btn'} disabled={this.state.submitting} onClick={this.handleLogin}>
                    LOGIN
                  </Button>
                </Col>
                {customErrors.errorMsg !== null && this.state.showValidationErrors ? <span className="error-text">{customErrors.errorMsg}</span> : ''}
              </FormGroup>
              <div>
                <Col smOffset={6} sm={2}>
                  <p style={{textAlign: 'center'}}><span>OR</span></p>
                </Col>
              </div>
              <FormGroup>
                <Col smOffset={5} sm={4}>
                  <Button className={'submit-btn'} disabled={this.state.submitting} onClick={this.showRegistration}>
                    SIGN UP
                  </Button>
                </Col>
              </FormGroup>
            </Form>
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
    loggedInStatus: store.userSession.loggedInStatus
  };
}
function bindActions(dispatch) {
  return {
    setUser: (data) => dispatch(setUser(data)),
    loginError: (data) => dispatch(loginError(data)),
    registerError: (data) => dispatch(registerError(data)),
    navigate: (data) => dispatch(navigate(data))
  };
}
export default connect(mapToState, bindActions)(App);
