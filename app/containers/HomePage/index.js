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
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import './styles.css';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  render() {
    return (
      <Container>
        <Row>
          <Jumbotron>
            <h1 className="display-3">Coucou.</h1>
            <p className="lead">
              Facebook absorbe beaucoup de données. Essayons de les explorer
              ensemble :)
            </p>
          </Jumbotron>
        </Row>
        <Row>
          <Col>
            <h2>Threads with the most messages.</h2>
          </Col>
          <Col>
            <h2>Threads I most posted in.</h2>
          </Col>
        </Row>
        <Row>
          <Widget url="//localhost:5002/threads?count=10" />
          <Widget url="//localhost:5002/threads?count=10&order=own" />
        </Row>
      </Container>
    );
  }
}
