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
import { FormattedMessage } from 'react-intl';
import Widget from 'components/Widget';

import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  render() {
    console.log(Widget);
    return (
      <div>
        <Widget
          title="Threads with the most messages."
          url="//localhost:5002/threads?count=10"
        />
        <Widget
          title="Threads I postedin."
          url="//localhost:5002/threads?count=10&order=own"
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}
