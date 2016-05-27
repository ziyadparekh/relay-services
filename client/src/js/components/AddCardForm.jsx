import React, { Component, PropTypes } from 'react';
import ReactCardFormContainer from 'card-react';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

const config = {
  inputNames: {
    number: 'number', // optional — default "number"
    expiry: 'expiry',// optional — default "expiry"
    cvc: 'cvc', // optional — default "cvc"
    name: 'name' // optional - default "name"
  },
  inputs: [
    {
      ref: 'number',
      label: 'Card Number',
      name: 'number',
      type: 'text'
    },
    {
      ref: 'name',
      label: 'Full Name',
      name: 'name',
      type: 'text'
    },
    {
      ref: 'expiry',
      label: 'MM/YY',
      name: 'expiry',
      type: 'text'
    },
    {
      ref: 'cvc',
      label: 'CVV',
      name: 'cvc',
      type: 'text'
    }
  ]
}

class CardLoader extends Component {
  static displayName = 'CardLoader'

  constructor(props) {
    super(props);
    this.initialValues = props.initialValues || {};
    this.cardObj = {
      name: this.initialValues.name  || '',
      number: this.initialValues.number || '',
      expiry: this.initialValues.expiry || '',
      cvc: this.initialValues.cvc || ''
    };
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.cardObj[name] = value;
  }

  getCardDetails() {
    debugger;
  }

  renderInputs() {
    return config.inputs.map((input, i) => {
      return (
        <TextField
          onChange={ this.handleChange.bind(this) }
          floatingLabelText={ input.label }
          type={ input.type }
          name={ input.name }
          key={ i } />
      );
    });
  }

  render() {
    return (
      <div>
        <div id="react-card-container"></div>
        <ReactCardFormContainer 
          formInputsNames={ config.inputNames }
          // initial values to render in the card element
          initialValues= { this.initialValues }
          container="react-card-container"
        >
          <form>
            { this.renderInputs() }
          </form>
        </ReactCardFormContainer>
        <RaisedButton
          primary={true}
          label='Activate Card'
          linkButton={true}
          onClick={ this.props.clickHandler }
        />
      </div>
    );
  }
}

export default CardLoader;