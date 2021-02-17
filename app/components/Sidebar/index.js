/**
 *
 * Sidebar
 *
 */

import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Users from 'components/UsersPage';

import './styles.css';
import messages from './messages';

function Sidebar(props) {
  const [usersList, setUsersList] = useState(false);
  const toggle = () => setUsersList(!usersList);
  return (
    <nav className="sidebar">
      {props.own ? (
        <React.Fragment>
          <div className="sidebar-header">
            <h3>{props.own.name}</h3>
          </div>
          <ul className="list-unstyled components">
            <li>
              <Dropdown isOpen={usersList} toggle={toggle}>
                <DropdownToggle
                  tag="span"
                  onClick={toggle}
                  data-toggle="dropdown"
                  aria-expanded={usersList}
                >
                  <FormattedMessage {...messages.users} />
                </DropdownToggle>
                <DropdownMenu>
                  <Users {...props} />
                </DropdownMenu>
              </Dropdown>
            </li>
            <li>
              <Link to="/threads">
                <FormattedMessage {...messages.threads} />
              </Link>
            </li>
            <li>
              <Link to="/cartho">
                <FormattedMessage {...messages.cartho} />
              </Link>
            </li>
          </ul>
        </React.Fragment>
      ) : (
        <div>
          <FormattedMessage {...messages.noData} />
        </div>
      )}
    </nav>
  );
}

Sidebar.propTypes = {
  own: PropTypes.object,
};

export default memo(Sidebar);
