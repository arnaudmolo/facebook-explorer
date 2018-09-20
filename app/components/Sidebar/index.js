/**
 *
 * Sidebar
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './styles.css';
import messages from './messages';

function Sidebar(props) {
  return (
    <nav className="sidebar">
      {props.title ? (
        <React.Fragment>
          <div className="sidebar-header">
            <h3>{props.title}</h3>
          </div>
          <ul className="list-unstyled components">
            <li className="active">
              <Link to="/">
                <FormattedMessage {...messages.home} />
              </Link>
            </li>
            <li>
              <Link to="/users">
                <FormattedMessage {...messages.users} />
              </Link>
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
  title: PropTypes.string,
};

export default Sidebar;
