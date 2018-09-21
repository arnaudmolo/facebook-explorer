import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { lifecycle, withProps } from 'recompose';
import { withConnect } from './index';

const enhance = compose(
  withConnect,
  lifecycle({
    componentWillMount() {
      this.props.requestThread(+this.props.match.params.id);
    },
    componentDidUpdate(newProps) {
      if (this.props.match.params.id !== newProps.match.params.id) {
        this.props.requestThread(+this.props.match.params.id);
      }
    },
  }),
  withProps(props => ({
    thread: props.threads.find(t => t.id === +props.match.params.id),
  })),
);

export const Thread = props => {
  let content = <h1>Loading...</h1>;
  if (props.thread) {
    content = (
      <div>
        <h1>{props.thread.title}</h1>
      </div>
    );
    if (props.thread.users) {
      content = (
        <div>
          <h1>{props.thread.title}</h1>
          <ul>
            {props.thread.users.map(([id, user]) => (
              <li key={id}>
                {user}{' '}
                {props.thread.meta[id] &&
                  `posted ${props.thread.meta[id]} messages`}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  return (
    <div>
      {content}
      <h3>Vizs will come there</h3>
    </div>
  );
};

Thread.propTypes = {
  thread: PropTypes.object,
};

export default enhance(Thread);
