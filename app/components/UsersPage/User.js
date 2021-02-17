import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PieChart from 'components/PieChart';
import ConversationTitle from 'components/ConversationTitle';

function User(props) {
  let content = 'loading';
  if (props.user.threads) {
    if (props.user.threads.length === 0) {
      content = <h5>You do not have any conversation with this person :(</h5>;
    } else {
      content = (
        <ListGroup>
          {props.user.threads.map(thread => (
            <ListGroupItem
              className="widget-group-item"
              key={thread.thread_path}
            >
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
    }
  }
  return (
    <div>
      <h5>{props.user.name}</h5>
      {content}
    </div>
  );
}

User.propTypes = {
  user: PropTypes.object,
};

export default User;
