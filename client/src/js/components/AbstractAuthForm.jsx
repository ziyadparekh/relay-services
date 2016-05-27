import React, { Component, PropTypes } from 'react';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import RaisedButton from 'material-ui/lib/raised-button';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import FontIcon from 'material-ui/lib/font-icon';

class AbstractAuthForm extends Component {
  static propTypes = {
    headerTitle: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    actionHandler: PropTypes.func.isRequired,
    textFields: PropTypes.array.isRequired,
    // Optional
    headerSubtitle: PropTypes.string,
    buttonIcon: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.headerTitle = this.props.headerTitle;
    this.buttonLabel = this.props.buttonLabel;
    this.textFields = this.props.textFields;
    this.headerSubtitle = this.props.headerSubtitle ?
      this.props.headerSubtitle : "";
    this.buttonIcon = this.props.buttonIcon ?
      this.props.buttonIcon : "";

    this.actionHandler = this.props.actionHandler;
  }

  renderCardHeader() {
    return (
      <CardHeader
        title={ this.headerTitle }
        subtitle={ this.headerSubtitle }
      />
    );
  }

  renderButtonIcon() {
    if (this.buttonIcon) {
      return <FontIcon className='material-icons'>{this.buttonIcon}</FontIcon>
    }
    return null;
  }

  renderCardFooter() {
    return (
      <CardActions expandable={false}>
        <RaisedButton
          primary={true}
          label={ this.buttonLabel }
          linkButton={true}
          onClick={ this.actionHandler }
          icon={ this.renderButtonIcon() }
        />
      </CardActions>
    );
  }

  renderTextField(textObject, i) {
    return (
      <div key={ i }>
        <TextField
          floatingLabelText={ textObject.label }
          type={ textObject.type }
          name={ textObject.name }
          key={ i } />
        <br />
      </div>
    );
  }

  renderCardBody() {
    return (
      <CardText expandable={false}>
        { this.textFields.map(this.renderTextField) }
      </CardText>
    );
  }

  render() {
    return (
      <Card>
        { this.renderCardHeader() }
        { this.renderCardBody() }
        { this.renderCardFooter() }
      </Card>
    );
  }
}

export default AbstractAuthForm;