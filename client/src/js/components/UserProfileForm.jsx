import React, { Component, PropTypes } from 'react';
import AbstractAuthForm from 'components/AbstractAuthForm';

const config = {
  headerTitle: 'Just a few more things',
  headerSubtitle: 'We need this additional information to clarify a few things',
  buttonLabel: 'Submit',
  textFields: [
    {
      label: 'First Name',
      name: 'firstName',
      type: 'text'
    },
    {
      label: 'Last Name',
      name: 'lastName',
      type: 'text'
    },
    {
      label: 'Phone Number',
      name: 'number',
      type: 'text'
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'text'
    }
  ]
};

class UserProfileForm extends Component {
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

export default UserProfileForm;