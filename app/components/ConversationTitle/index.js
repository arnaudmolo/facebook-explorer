/**
 *
 * ConversationTitle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './styles.css';

function ConversationTitle(props) {
  return (
    <div className="conversation-title">
      <NavLink to={props.to}>
        {props.loading ? 'Loading...' : props.children}
      </NavLink>
    </div>
  );
}

ConversationTitle.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.any,
  to: PropTypes.any,
};

export default ConversationTitle;
