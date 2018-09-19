/**
 *
 * Sidebar
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import 'reactstrap';
import PropTypes from 'prop-types';
import './styles.css';
// import styled from 'styled-components';

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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/threads">Threads</Link>
            </li>
            <li>
              <Link to="/cartho">Carthographie</Link>
            </li>
          </ul>
        </React.Fragment>
      ) : (
        <div>
          No data is beeing loaded. Please follow the readme instructions.
        </div>
      )}
    </nav>
  );
}

Sidebar.propTypes = {
  title: PropTypes.string,
};

export default Sidebar;
