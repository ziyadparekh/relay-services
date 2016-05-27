import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Navbar from 'components/Navbar';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import defaultTheme from 'themes/defaultTheme';

const App = React.createClass({
  //the key passed through context must be called "muiTheme"
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: getMuiTheme(defaultTheme),
    };
  },

  render() {
    return (
      <div>
        <Navbar />
        <IndexLink to='/'>Home</IndexLink> | <Link to='/about'>About</Link>
        <br />
        { this.props.children }
      </div>
    );
  }
});

App.propTypes = {
  children: PropTypes.element
};

export default App;