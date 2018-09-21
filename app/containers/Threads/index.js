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

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Widget from 'components/Widget';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { requestThreads, requestThread } from './actions';

const Thread = lifecycle({
  componentWillMount() {
    this.props.onMount();
  },
})(props => {
  let content = <h1>Loading...</h1>;
  if (props.thread) {
    content = <h1>{props.thread.title}</h1>;
    if (props.thread.users) {
      content = (
        <div>
          <h1>{props.thread.title}</h1>
          <ul>
            {props.thread.users.map(([id, user]) => <li key={id}>{user}</li>)}
          </ul>
        </div>
      );
    }
  }
  return (
    <div>
      {content}
      <h3>Vizs will come there</h3>
    </div>
  );
});

Thread.propTypes = {
  onMount: PropTypes.func,
};

function Threads(props) {
  const { threads } = props;
  const threadId = +props.match.params.id;
  const selected = props.threads.find(thread => thread.id === threadId);
  return (
    <Container>
      <Row>
        <Col xs="3">
          <Widget threads={threads} />
        </Col>
        <Col>
          {props.match.params.id && (
            <Thread
              onMount={() => props.requestThread(threadId)}
              thread={selected}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

Threads.propTypes = {
  threads: PropTypes.array,
  match: PropTypes.object,
  requestThread: PropTypes.func,
};

const mapStateToProps = makeSelectThreads();

const withConnect = connect(
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
