/**
 *
 * Threads
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';
import { scaleOrdinal } from 'd3';
import { head } from 'ramda';
import { FormattedMessage } from 'react-intl';
import { withProps } from 'recompose';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Widget from 'components/Widget';
import makeSelectThreads from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { requestThreads, requestThread } from './actions';
import Linechart from '../../components/Linechart';

import { agregateByHours, orderByDate } from './mapDataToStack';

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
        <Col xs="9">
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
  withProps(props => {
    useEffect(
      () => {
        if (!props.loading) {
          props.requestThreads();
        }
      },
      [props.loading],
    );
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

const Thread = compose(withConnect)(props => {
  useEffect(
    () => {
      props.requestThread(+props.match.params.id);
    },
    [props.match.params.id],
  );
  const thread = props.threads.find(t => t.id === +props.match.params.id);
  let content = <h1>Loading...</h1>;
  if (thread) {
    content = (
      <div>
        <h1>{thread.title}</h1>
      </div>
    );
    if (thread.users) {
      const usersId = thread.users.map(head);
      content = (
        <div>
          <h1>{thread.title}</h1>
          <ul>
            {thread.users.map(([id, user], index) => (
              <li style={{ backgroundColor: color(index) }} key={id}>
                {user} {thread.meta[id] && `posted ${thread.meta[id]} messages`}
              </li>
            ))}
          </ul>
          <h1>
            <FormattedMessage {...messages.vizByHourTitle} />
          </h1>
          <Linechart
            ids={usersId}
            width={700}
            height={300}
            data={agregateByHours(d => d.datetime, usersId)(thread.messages)}
          />
          <h1>
            <FormattedMessage {...messages.vizMessageByDay} />
          </h1>
          <Linechart
            ids={usersId}
            width={700}
            height={300}
            data={orderByDate(d => d.datetime, usersId)(thread.messages)}
          />
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
