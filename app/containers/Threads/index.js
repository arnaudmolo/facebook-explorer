/**
 *
 * Threads
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { lifecycle } from 'recompose';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Widget from 'components/Widget';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { requestThreads, requestThread } from './actions';
import { Thread } from './Thread';

function Threads(props) {
  const { threads } = props;
  return (
    <Container>
      <Row>
        <Col xs="3">
          <Widget threads={threads} />
        </Col>
        <Col>
          <Route path="/threads/:id" component={Thread} />
        </Col>
      </Row>
    </Container>
  );
}

Threads.propTypes = {
  threads: PropTypes.array,
};

const mapStateToProps = makeSelectThreads();

export const withConnect = connect(
  mapStateToProps,
  { requestThreads, requestThread },
);

const withReducer = injectReducer({ key: 'threads', reducer });
const withSaga = injectSaga({ key: 'threads', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  lifecycle({
    componentWillMount() {
      if (!this.props.loading) {
        this.props.requestThreads();
      }
    },
  }),
)(Threads);
