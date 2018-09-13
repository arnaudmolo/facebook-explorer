/**
 *
 * Sidebar
 *
 */

import React from 'react';
import 'reactstrap';
import PropTypes from 'prop-types';
import './styles.css';
// import styled from 'styled-components';

function Sidebar(props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>{props.title}</h3>
      </div>
      <ul className="list-unstyled components">
        <li className="active">
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/users">USers</a>
        </li>
        <li>
          <a href="/threads">Threads</a>
        </li>
        <li>
          <a href="/cartho">Carthographie</a>
        </li>
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  title: PropTypes.string,
};

export default Sidebar;
