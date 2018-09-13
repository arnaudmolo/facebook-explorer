/**
 *
 * ConversationTitle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

function ConversationTitle(props) {
  return (
    <div className="conversation-title">
      <p>{props.loading ? 'Loading...' : props.children}</p>
    </div>
  );
}

ConversationTitle.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.element,
};

export default ConversationTitle;
