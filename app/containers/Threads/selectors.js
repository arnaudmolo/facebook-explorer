import { createSelector } from 'reselect';
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
  createSelector(selectThreadsDomain, substate => substate.toJS());

export default makeSelectThreads;
export { selectThreadsDomain };
