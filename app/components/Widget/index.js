/**
 *
 * Widget
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import request from 'utils/request';
import ConversationTitle from 'components/ConversationTitle';
import PieChart from 'components/PieChart';
import { ListGroup, ListGroupItem } from 'reactstrap';
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
  'meta',
]);

const Widget = props => {
  const { url } = props;

  const [threads, setThreads] = useState([]);

  useEffect(
    async () => {
      setThreads(await request(url).then(map(zip)));
    },
    [url],
  );

  return (
    <ListGroup>
      {threads.map(thread => (
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
};

Widget.propTypes = {
  url: PropTypes.string,
};

export default Widget;
