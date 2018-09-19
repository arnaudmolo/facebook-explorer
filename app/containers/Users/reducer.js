/*
 *
 * Users reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_USERS, LOAD_USERS, LOAD_USER } from './constants';

export const initialState = fromJS({
  loading: false,
  users: [],
});

const insertLoadedUsers = (state, user) =>
  state.update(state.findIndex(item => item.get('id') === user.id), item =>
    item.set('messages', user.messages).set('threads', user.threads),
  );

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return state.set(
        'users',
        insertLoadedUsers(state.get('users'), action.payload),
      );
    case REQUEST_USERS:
      return state.set('loading', true);
    case LOAD_USERS:
      return state.set('users', fromJS(action.payload)).set('loading', false);
    default:
      return state.set('loading', false);
  }
}

export default usersReducer;
