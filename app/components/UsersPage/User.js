import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PieChart from 'components/PieChart';
import ConversationTitle from 'components/ConversationTitle';

function User(props) {
  return (
    <div>
      <h5>{props.user.name}</h5>
      {props.user.threads && (
        <ListGroup>
          {props.user.threads.map(thread => (
            <ListGroupItem
              className="widget-group-item"
              key={thread.thread_path}
            >
              <ConversationTitle>{thread.title}</ConversationTitle>
              {thread.meta && (
                <PieChart width={20} height={20} values={thread.meta} />
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

User.propTypes = {
  user: PropTypes.object,
};

export default User;
