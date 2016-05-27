import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from 'actions/auth';

import SignupForm from 'components/SignupForm';
import CodeVerificationForm from 'components/CodeVerificationForm';
import UserProfileForm from 'components/UserProfileForm';
import AddCardForm from 'components/AddCardForm';

class AuthContainer extends Component {
  
  handleClick(e) {
    this.props.actions.transitionAuthPhase(1);
  }

  handleUserProfileSubmit(e) {
    this.props.actions.transitionAuthPhase(2);
  }

  handleCodeVerification(e) {
    this.props.actions.transitionAuthPhase(3);
  }

  handleCardActivation(e) {
    var cardObj = this.refs.card.getCardDetails();
    this.props.actions.transitionAuthPhase(0);
  }

  render() {
    const step = this.props.authed.step;
    switch(step) {
      case 1:
      return (
        <SignupForm
          ref='signup'
          clickHandler={ this.handleClick.bind(this) }
          { ...this.props } 
        />
      );
      case 2:
      return (
        <UserProfileForm 
          ref='profile'
          clickHandler={ this.handleUserProfileSubmit.bind(this) }
          { ...this.props } />
      );
      case 3:
      return (
        <CodeVerificationForm
          ref='code'
          clickHandler={ this.handleCodeVerification.bind(this) }
          { ...this.props } 
        />
      );
      case 4:
      return (
        <AddCardForm
          ref='card'
          clickHandler={ this.handleCardActivation.bind(this) }
          { ...this.props }
        />
      );
      default:
      return (<div></div>);
    }
  }
}

function mapStateToProps(state) {
  const { authed } = state;
  return {
    authed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer);