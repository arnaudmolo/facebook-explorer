import { flatten } from 'ramda';
import { createSelector } from 'reselect';
import makeSelectUsers from 'containers/Users/selectors';
import { initialState } from './reducer';

/**
 * Direct selector to the threads state domain
 */

const selectThreadsDomain = state => state.get('threads', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Threads
 */

const makeSelectThreads = () =>
  createSelector(selectThreadsDomain, makeSelectUsers(), (substate, users) => {
    if (substate.get('threads').count()) {
      return substate.toJS();
    }
    return {
      threads: flatten(users.map(user => user.threads)).filter(e => e),
      loading: substate.get('loading'),
    };
  });

export default makeSelectThreads;
export { selectThreadsDomain };
