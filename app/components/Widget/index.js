/**
 *
 * Widget
 *
 */

import React from 'react';
import request from 'utils/request';
import ConversationTitle from 'components/ConversationTitle';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class Widget extends React.PureComponent {
  state = {
    threads: [],
  };
  async componentWillMount() {
    try {
      this.setState({
        threads: await request('//localhost:5002/threads?count=10'),
      });
    } catch (error) {
      throw error;
    }
  }
  render() {
    const { threads } = this.state;
    return (
      <div>
        {threads.map(thread => (
          <div key={thread.thread_path}>
            <ConversationTitle>{thread.title}</ConversationTitle>
            {thread.meta.mine} / {thread.meta.total}
          </div>
        ))}
      </div>
    );
  }
}

Widget.propTypes = {};

export default Widget;
