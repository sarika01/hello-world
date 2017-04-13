import React, {Component} from 'react';
import {connect} from 'react-redux';
import './styles.css';
import {logoutUser} from '../../actions/userSession';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';

class ResultPage extends Component {
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
      <Paper style={{margin: '10px'}} zDepth={3} >
        <List>
          {
            this.props.allResults.map((user, index) => {
              return (<ListItem key={index} primaryText={user.info.name + ' - ' + user.result.score + '/' + user.result.total} />);
            })
          }
        </List>
      </Paper>
    );
  }
}

ResultPage.propTypes = {
  
};

function mapToState(store) {
  return {
    allResults: store.activeEvents.allResults,
    allResultsError: store.activeEvents.allResultsError,
    errorMessage: store.activeEvents.errorMessage,
    loading: store.activeEvents.loading,
  };
}

function bindActions(dispatch){
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(mapToState, bindActions)(ResultPage);
