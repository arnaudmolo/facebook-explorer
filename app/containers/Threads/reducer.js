/*
 *
 * Threads reducer
 *
 */

import { fromJS } from 'immutable';
import { LOAD_THREADS, REQUEST_THREADS } from './constants';

export const initialState = fromJS({
  loading: false,
  threads: [],
});

function threadsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_THREADS:
      return state.set('loading', true);
    case LOAD_THREADS:
      return state.set('threads', fromJS(action.payload));
    default:
      return state;
  }
}

export default threadsReducer;
