import React, {Component} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {logoutUser} from '../../actions/userSession';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
  }
  logout() {
    this.props.logoutUser();
  }
  render() {
    return (
      <div className={'box-container'}>
        <div className={"text-container"}>
            <p className={"desc-text"}>Welcome to online options. You can check your online options from the active options tab.</p>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  
};

function mapToState(store) {
  return {
  };
}

function bindActions(dispatch){
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(mapToState, bindActions)(HomePage);
