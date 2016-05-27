import React, { Component, PropTypes } from 'react';
import AbstractAuthForm from 'components/AbstractAuthForm';

const config = {
  headerTitle: 'Signup for your Bespoke Wallet',
  headerSubtitle: 'Choose a unique username and password for your account',
  buttonLabel: 'Create your Bespoke Wallet',
  buttonIcon: 'lock_outline',
  textFields: [
    {
      label: 'Username',
      name: 'username',
      type: 'text'
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password'
    }
  ]
};

class SignupForm extends Component {
  render() {
    return (
      <AbstractAuthForm
      headerTitle={ config.headerTitle }
      headerSubtitle={ config.headerSubtitle }
      buttonLabel={ config.buttonLabel }
      buttonIcon={ config.buttonIcon }
      textFields={ config.textFields }
      actionHandler={ this.props.clickHandler }
      />
    );
  }
}

export default SignupForm;