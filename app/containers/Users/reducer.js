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

// const insertLoadedUser = (state, user) =>
//   ;

function usersReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER:
      return state.set(
        'users',
        state
          .get('users')
          .update(
            state
              .get('users')
              .findIndex(item => item.get('id') === action.payload.id),
            item =>
              item
                .set('messages', fromJS(action.payload.messages))
                .set('threads', fromJS(action.payload.threads)),
          ),
      );
    case REQUEST_USERS:
      return state.set('loading', true);
    case LOAD_USERS:
      return state.set('users', fromJS(action.payload)).set('loading', false);
    default:
      return state;
  }
}

export default usersReducer;
