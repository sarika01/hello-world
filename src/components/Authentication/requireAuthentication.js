import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {navigate} from '../../actions/route';
import { browserHistory } from 'react-router';
import {logoutUserSuccess} from '../../actions/userSession';

export default function(ComposedComponent){
  class Authentication extends Component {
    static propTypes = {
      authenticationStore: PropTypes.object,
      navigate: PropTypes.func,
      logoutUserSuccess: PropTypes.func
    }

    componentWillMount() {
        console.log('at requireAuthentication', this.props.authenticationStore.loggedInStatus);
      this.checkLoggedInStatus(this.props);
    }

    componentWillUpdate(nextProps) {
      if (this.props.authenticationStore.loggedInStatus !== nextProps.authenticationStore.loggedInStatus) {
        this.checkLoggedInStatus(nextProps);
      }
    }

    checkLoggedInStatus(props) {
        console.log('checking!!!', props.authenticationStore);
      if (props.authenticationStore.loggedInStatus) {
        let diffinDays = -1;
        //Check if loggedInStatus is more than one day
        function dateDiffInDays(a,b) {
          let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
          let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

          return Math.floor((utc2 - utc1) / 1000 * 60 * 60 * 24);
        }
        if (props.authenticationStore.loggedInTime) {
          let current = new Date();
          diffinDays = dateDiffInDays(current,new Date(props.authenticationStore.loggedInTime));
        }
        console.log('diffindays', diffinDays);
        if (diffinDays === 0) {
          //
        } else {
          console.log('logout!!!');
          props.logoutUserSuccess();
          browserHistory.push('/myTest/');
        }
      } else {
        browserHistory.push('/myTest/');
      }
    }

    render () {
      // Check your redux store for an isAuthenticated attribute
      // If is authenticated return the composed component
      return <ComposedComponent {...this.props} />;
    }
  }
  // Map state to props
  function mapStateToProps(store){
    return {
        authenticationStore: store.userSession
    };
  }
  function bindActions(dispatch) {
      return {
        navigate: (data) => dispatch(navigate(data)),
        logoutUserSuccess: (data) => dispatch(logoutUserSuccess())
      };
  }
  return connect(mapStateToProps, bindActions)(Authentication);
}
