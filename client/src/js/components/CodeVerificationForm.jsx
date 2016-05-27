import React, { Component, PropTypes } from 'react';
import AbstractAuthForm from 'components/AbstractAuthForm';

const config = {
  headerTitle: 'Enter the 4-digit passcode',
  headerSubtitle: 'We sent a code to <name@email.com>. Please paste it here.',
  buttonLabel: 'Submit',
  textFields: [
    {
      label: 'Passcode',
      name: 'passcode',
      type: 'text'
    }
  ]
};

class CodeVerificationForm extends Component {
  render() {
    return (
      <AbstractAuthForm
      headerTitle={ config.headerTitle }
      headerSubtitle={ config.headerSubtitle }
      buttonLabel={ config.buttonLabel }
      textFields={ config.textFields }
      actionHandler={ this.props.clickHandler }
      />
    );
  }
}

export default CodeVerificationForm;