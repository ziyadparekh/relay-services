import React, {Component, PropTypes} from 'react';
import Link from 'components/Link';
import NavSearch from 'components/NavSearch';
import Popover from 'components/Popover';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }
  renderNavUser() {
    return (
      <Popover className='nav-user'>
        <div className='nav-user-link'>
          <i className='icon ion-person'></i>
          <i className='icon ion-chevron-down'></i>
          <i className='icon ion-chevron-up'></i>
        </div>
        <div className='nav-user-popover popover-content'>
          <ul className='nav-user-popover-list'>
            <li className='nav-user-popover-item'>
              <a 
                href='#' 
                className='button orange block'
                onClick={this.login}>
                Sign into Bespoke
              </a>
            </li>
          </ul>
        </div>
      </Popover>
    );
  }
  render() {
    return (
      <div className='nav'>
        <div className='container clearfix'>
          <div className='nav-logo'>
            <i className='icon ion-radio-waves' />
          </div>
          <div className='nav-nav float-left'>
            <div className='nav-nav-item'>
              <Link
                className='nav-nav-item-link active'
                {...this.props}>
                Bespoke
              </Link>
            </div>
          </div>
          <div className='nav-nav float-right'>
            <div className='nav-nav-item'>
              <NavSearch {...this.props} />
            </div>
            <div className='nav-nav-item'>
              {this.renderNavUser()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;