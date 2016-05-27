import React, {Component, PropTypes} from 'react';

class Link extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
  }

  render() {
    const {children, title, className} = this.props;
    return (
      <a
        className={className}
        href='#'
        onClick={this.handleClick}
        title={title ? title : ''}>
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  className: PropTypes.string,
  dipatch: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default Link;