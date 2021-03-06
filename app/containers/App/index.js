/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose, branch, withProps } from 'recompose';

import HomePage from 'containers/HomePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Users from 'containers/Users';
import Sidebar from 'components/Sidebar';
import UsersPage from 'components/UsersPage';
import Threads from 'containers/Threads';

import './styles.css';

const Navigation = compose(
  Users,
  branch(props => props.own, withProps(props => ({ title: props.own.name }))),
)(Sidebar);

export default () => (
  <div className="wrapper">
    <Navigation />
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/users" component={UsersPage} />
      <Route exact path="/threads" component={Threads} />
      <Route exact path="/threads/:id" component={Threads} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);
