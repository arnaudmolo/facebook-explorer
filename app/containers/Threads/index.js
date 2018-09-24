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
import { lifecycle, withProps } from 'recompose';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';
import { scaleOrdinal } from 'd3';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Widget from 'components/Widget';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { requestThreads, requestThread } from './actions';
import Linechart from '../../components/Linechart';

const mapStateToProps = makeSelectThreads();

export const withConnect = connect(
  mapStateToProps,
  { requestThreads, requestThread },
);

const withReducer = injectReducer({ key: 'threads', reducer });
const withSaga = injectSaga({ key: 'threads', saga });

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

const color = scaleOrdinal().range([
  '#be5926',
  '#686cc8',
  '#57b14b',
  '#ae56c2',
  '#a6b447',
  '#ce4685',
  '#52ae88',
  '#d64546',
  '#5b9ed4',
  '#df8b30',
  '#c681bd',
  '#c49c40',
  '#aa5159',
  '#6d7631',
  '#d88c6c',
]);

const Thread = compose(
  withConnect,
  lifecycle({
    componentWillMount() {
      this.props.requestThread(+this.props.match.params.id);
    },
    componentDidUpdate(newProps) {
      if (this.props.match.params.id !== newProps.match.params.id) {
        this.props.requestThread(+this.props.match.params.id);
      }
    },
  }),
  withProps(props => ({
    thread: props.threads.find(t => t.id === +props.match.params.id),
  })),
)(props => {
  let content = <h1>Loading...</h1>;
  if (props.thread) {
    content = (
      <div>
        <h1>{props.thread.title}</h1>
      </div>
    );
    if (props.thread.users) {
      content = (
        <div>
          <h1>{props.thread.title}</h1>
          <ul>
            {props.thread.users.map(([id, user], index) => (
              <li style={{ backgroundColor: color(index) }} key={id}>
                {user}{' '}
                {props.thread.meta[id] &&
                  `posted ${props.thread.meta[id]} messages`}
              </li>
            ))}
          </ul>
          <Linechart width={800} height={500} data={props.thread.messages} />
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
