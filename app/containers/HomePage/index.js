/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { useState, useEffect } from 'react';
import Widget from 'components/Widget';
import { FormattedMessage } from 'react-intl';
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import { map, zipObj } from 'ramda';
import { mapProps } from 'recompose';
import request from 'utils/request';
import messages from './messages';
import './styles.css';

const zip = zipObj([
  'id',
  'title',
  'is_still_participant',
  'status',
  'thread_type',
  'thread_path',
  'meta',
]);

const useLoadUrl = url => {
  const [threads, setThreads] = useState([]);
  useEffect(
    async () => {
      setThreads(await request(url).then(map(zip)));
    },
    [url],
  );
  return threads;
};

const WidgetByUrl = mapProps(props => ({
  threads: useLoadUrl(props.url),
}))(Widget);

const HomePage = () => (
  <Container>
    <Row>
      <Jumbotron>
        <h1 className="display-3">
          <FormattedMessage {...messages.header} />
        </h1>
        <p className="lead">
          <FormattedMessage {...messages.lead} />
        </p>
      </Jumbotron>
    </Row>
    <Row>
      <Col>
        <h2>
          <FormattedMessage {...messages.mostMessages} />
        </h2>
      </Col>
      <Col>
        <h2>
          <FormattedMessage {...messages.myMessages} />
        </h2>
      </Col>
    </Row>
    <Row>
      <Col>
        <WidgetByUrl url="//localhost:5002/threads?count=10" />
      </Col>
      <Col>
        <WidgetByUrl url="//localhost:5002/threads?count=10&order=own" />
      </Col>
    </Row>
  </Container>
);

export default HomePage;
