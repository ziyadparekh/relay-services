import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

class NavSearch extends Component {
  constructor(props) {
    super(props);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    this.onSlashPress = this.onSlashPress.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keypress', this.onSlashPress, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keyCode', this.onSlashPress, false);
  }
  handleOnKeyPress(e) {
    if (e.charCode === 13) {
      const value = e.currentTarget.value.trim();
      if (value !== '') {
        console.log(value);
      }
    }
  }
  onSlashPress(e) {
    const keyCode = e.keyCode || e.which;
    const isInsideInput = e.target.tagName.toLowerCase().match(/input|textarea/);
    if (keyCode === 47 && !isInsideInput) {
      e.preventDefault();
      ReactDOM.findDOMNode(this.refs.query).focus();
    }
  }
  render() {
    return (
      <div className='nav-search'>
        <i className='icon ion-search'></i>
        <input 
          ref='query' 
          className='nav-search-input' 
          placeholder='Search'
          onKeyPress={this.handleOnKeyPress}
          type='text' 
        />
      </div>
    );
  }
}

export default NavSearch;