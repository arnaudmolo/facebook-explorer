/*
 *
 * Users reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_USERS, LOAD_USERS } from './constants';

export const initialState = fromJS({
  users: [],
});

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_USERS:
      return state;
    case LOAD_USERS:
      return state.set('users', action.payload);
    default:
      return state;
  }
}

export default usersReducer;
