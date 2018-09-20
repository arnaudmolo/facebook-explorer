/**
 *
 * Threads
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { lifecycle } from 'recompose';
import Widget from 'components/Widget';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { requestThreads } from './actions';

function Threads(props) {
  const { threads } = props;
  return (
    <div>
      <FormattedMessage {...messages.header} />
      <Widget threads={threads} />
    </div>
  );
}

Threads.propTypes = {
  threads: PropTypes.array,
};

const mapStateToProps = makeSelectThreads();

const withConnect = connect(
  mapStateToProps,
  { requestThreads },
);

const withReducer = injectReducer({ key: 'threads', reducer });
const withSaga = injectSaga({ key: 'threads', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  lifecycle({
    componentWillMount() {
      if (!this.props.loading && this.props.threads.length === 0) {
        this.props.requestThreads();
      }
    },
  }),
)(Threads);
