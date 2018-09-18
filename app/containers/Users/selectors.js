import { find } from 'ramda';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the users state domain
 */

const selectUsersDomain = state => state.get('users', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Users
 */

const friendship = user => user.friendship;

const makeSelectUsers = () =>
  createSelector(selectUsersDomain, substate => substate.get('users').toJS());

const makeSelectOwnUser = () =>
  createSelector(makeSelectUsers(), find(user => friendship(user) === 'own'));

const isLoadingSelector = createSelector(selectUsersDomain, state =>
  state.get('loading'),
);

export default makeSelectUsers;
export { selectUsersDomain, makeSelectOwnUser, isLoadingSelector };
