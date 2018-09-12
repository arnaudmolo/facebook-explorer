/*
 *
 * Users actions
 *
 */

import { REQUEST_USERS, LOAD_USERS, REQUEST_USERS_ERROR } from './constants';

export function requestUsers() {
  return {
    type: REQUEST_USERS,
  };
}

export function loadedUsers(users) {
  return {
    type: LOAD_USERS,
    payload: users,
  };
}

export function requestUsersError(err) {
  console.error(err);
  return {
    type: REQUEST_USERS_ERROR,
  };
}
