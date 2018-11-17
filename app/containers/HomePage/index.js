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

import React from 'react';
import Widget from 'components/Widget';
import { FormattedMessage } from 'react-intl';
import { Jumbotron, Container, Row, Col } from 'reactstrap';

import messages from './messages';
import './styles.css';

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
        <Widget url="//localhost:5002/threads?count=10" />
      </Col>
      <Col>
        <Widget url="//localhost:5002/threads?count=10&order=own" />
      </Col>
    </Row>
  </Container>
);

export default HomePage;
