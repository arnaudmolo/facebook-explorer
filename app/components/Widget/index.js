/**
 *
 * Widget
 *
 */

import React from 'react';
import request from 'utils/request';
import ConversationTitle from 'components/ConversationTitle';
import PieChart from 'components/PieChart';
import { ListGroup, ListGroupItem } from 'reactstrap';
import './styles.css';

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
      <div className="widget-container">
        <p>Threads with the most messages</p>
        <ListGroup>
          {threads.map(thread => (
            <ListGroupItem
              className="widget-group-item"
              key={thread.thread_path}
            >
              <ConversationTitle>{thread.title}</ConversationTitle>
              <PieChart
                width={20}
                height={20}
                values={[
                  thread.meta.mine,
                  thread.meta.total - thread.meta.mine,
                ]}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  }
}

Widget.propTypes = {};

export default Widget;
