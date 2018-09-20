/**
 *
 * Threads
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function Threads() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Threads.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  threads: makeSelectThreads(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'threads', reducer });
const withSaga = injectSaga({ key: 'threads', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Threads);
