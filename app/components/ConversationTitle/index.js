/**
 *
 * ConversationTitle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';

function ConversationTitle(props) {
  return (
    <div className="conversation-title">
      <Link to={props.to}>
        {props.loading
          ? 'Loading...'
          : decodeURIComponent(escape(props.children))}
      </Link>
    </div>
  );
}

ConversationTitle.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.any,
  to: PropTypes.any,
};

export default ConversationTitle;
