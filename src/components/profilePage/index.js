import React, {Component} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {logoutUser, fetchedProfileImage, addUserName} from '../../actions/userSession';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import Snackbar from 'material-ui/Snackbar';
import {get} from 'lodash';

const customErrors = {
  userName: null,
  errorMsg: null
};

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', showValidationErrors: false, email: '', profilePic: null, open: false};
    this.logout = this.logout.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  componentDidMount () {
      if (this.props.username) {
          this.setState({userName: this.props.username});
      }
  }
  componentWillReceiveProps (nextProps) {
      if (this.state.userName === '' && nextProps.username) {
          this.setState({userName: nextProps.username});
      }
  }
  logout() {
    this.props.logoutUser();
  }
  onDrop(files) {
    let fr = new window.FileReader();
    let self = this;
    fr.onload = function (e) {
        self.setState({profilePic: {img: fr.result, file: files[0]}});
    };
    fr.readAsDataURL(files[0]);
  }
  handleSave() {
    var self = this;
    customErrors.userName = null;
    customErrors.errorMsg = null
    if (this.state.userName.trim() === '') {
      customErrors.userName = "* Please enter your name";
    } else if (!/^[a-z A-Z\u00C0-\u00ff]+$/.test(this.state.userName)) {
      customErrors.userName = "* name can have only alphabets";
    }
    if (customErrors.userName !== null) {
        this.setState({
            showValidationErrors: true
        });
    } else {
        self.props.addUserName({name: self.state.userName.trim(), email: self.props.user.email});
        if (!(self.state.profilePic && self.state.profilePic.file)) {
          self.setState({
            open: true
          });
        }
    }
    if (this.state.profilePic && this.state.profilePic.file) {
        var email = this.props.user.email.replace(/\./g, ';');
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var imageRef = storageRef.child('profiles/' + email);
        imageRef.put(this.state.profilePic.file).then(function(snapshot) {
            self.props.fetchedProfileImage(snapshot.a.downloadURLs[0]);
            if (!self.state.showValidationErrors) {
              self.setState({
                open: true
              });
            }
        })
        .catch(function(error){
            customErrors.errorMsg = "error in saving profile picture";
            self.setState({showValidationErrors: true});
        });
    }
  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  render() {
    return (
      <div className={'box-container'}>
        <Snackbar
          open={this.state.open}
          message="Your profile is updated"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <List>
            <ListItem>
                <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} disablePreview={false} style={{display: 'flex', justifyContent: 'center'}}>
                {
                    this.state.profilePic
                    ?
                    <div><img src={this.state.profilePic.img} className={'profile-img'} alt={''} /></div>
                    :
                        this.props.userAvatar
                        ?
                        <div><img src={this.props.userAvatar} className={'profile-img'} alt={''} /></div>
                        :
                        <div><img src={'/myTest/profile-placeholder.png'} className={'profile-img'} alt={''} /></div>
                }
                </Dropzone>
            {customErrors.errorMsg !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.errorMsg}</span> : ''}
           </ListItem>
            <ListItem disabled={true} >
                <TextField
                  hintText="enter your full name"
                  floatingLabelText="Name"
                  value={this.state.userName}
                  onChange={(e) => this.setState({userName: e.target.value, showValidationErrors: false})}
                />
                {customErrors.userName !== null && this.state.showValidationErrors ? <span className="text-danger">{customErrors.userName}</span> : ''}
            </ListItem>
            <ListItem disabled={true} >
                <TextField
                  hintText="enter you email address"
                  floatingLabelText="Email"
                  value={get(this.props, 'user.email', '')}
                  disabled={true}
                />
            </ListItem>
            <ListItem>
                <RaisedButton label="Save" primary={true} className={'button'} 
                  disabled={this.state.submitting} onClick={this.handleSave}/>
            </ListItem>
        </List>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  
};

function mapToState(store) {
  return {
      user: store.userSession.user,
      userAvatar: store.userSession.userAvatar,
      username: store.userSession.username
  };
}

function bindActions(dispatch){
  return {
    logoutUser: () => dispatch(logoutUser()),
    fetchedProfileImage: (data) => dispatch(fetchedProfileImage(data)),
    addUserName: (data) => dispatch(addUserName(data))
  };
}

export default connect(mapToState, bindActions)(ProfilePage);
