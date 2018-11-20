/**
 *
 * Widget
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ConversationTitle from 'components/ConversationTitle';
import PieChart from 'components/PieChart';
import { ListGroup, ListGroupItem } from 'reactstrap';
import './styles.css';

const Widget = props => (
  <ListGroup>
    {props.threads.map(thread => (
      <ListGroupItem className="widget-group-item" key={thread.thread_path}>
        <ConversationTitle to={`/threads/${thread.id}`}>
          {thread.title}
        </ConversationTitle>
        {thread.meta && (
          <PieChart width={20} height={20} values={thread.meta} />
        )}
      </ListGroupItem>
    ))}
  </ListGroup>
);

Widget.propTypes = {
  threads: PropTypes.array,
};

export default Widget;
