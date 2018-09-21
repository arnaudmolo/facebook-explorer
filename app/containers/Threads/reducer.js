/*
 *
 * Threads reducer
 *
 */

import { fromJS } from 'immutable';
import { LOAD_THREADS, REQUEST_THREADS, LOAD_THREAD } from './constants';

export const initialState = fromJS({
  loading: false,
  threads: [],
});

function threadsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_THREADS:
      return state.set('loading', true);
    case LOAD_THREADS:
      return state.set(
        'threads',
        action.payload
          .reduce((s, payload) => reduceThreadList(s, { payload }), state)
          .get('threads')
          .sortBy(
            a =>
              -a
                .get('meta')
                .toArray()
                .reduce((e, n) => e + n, 0),
          ),
      );
    case LOAD_THREAD:
      return reduceThreadList(state, action);
    default:
      return state;
  }
}

export default threadsReducer;

function reduceThreadList(state, action) {
  const toUpdate = state
    .get('threads')
    .findIndex(item => item.get('id') === action.payload.id);
  if (toUpdate >= 0) {
    return state.set(
      'threads',
      state
        .get('threads')
        .update(toUpdate, item =>
          item
            .set('messages', fromJS(action.payload.messages))
            .set('users', fromJS(action.payload.users)),
        ),
    );
  }
  return state.set(
    'threads',
    state.get('threads').push(fromJS(action.payload)),
  );
}
