/**
 *
 * Widget
 *
 */

import React from 'react';
import request from 'utils/request';
import ConversationTitle from 'components/ConversationTitle';
import PieChart from 'components/PieChart';
import { ListGroup, ListGroupItem, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { lifecycle, withState, compose } from 'recompose';
import { zipObj, map } from 'ramda';
import './styles.css';

// import styled from 'styled-components';
const zip = zipObj([
  'id',
  'title',
  'is_still_participant',
  'status',
  'thread_type',
  'thread_path',
  'total',
  'own',
]);

const withAsync = compose(
  withState('threads', 'setThreads', []),
  lifecycle({
    async componentWillMount() {
      this.props.setThreads(await request(this.props.url).then(map(zip)));
    },
  }),
);

/* eslint-disable react/prefer-stateless-function */
class Widget extends React.PureComponent {
  render(props = this.props) {
    const { threads } = props;
    return (
      <Col>
        <h2>{this.props.title}</h2>
        <ListGroup>
          {threads.map(thread => (
            <ListGroupItem
              className="widget-group-item"
              key={thread.thread_path}
            >
              <ConversationTitle>{thread.title}</ConversationTitle>
              {thread.own && (
                <PieChart
                  width={20}
                  height={20}
                  values={[thread.own, thread.total - thread.own]}
                />
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Col>
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string,
};

export default withAsync(Widget);
