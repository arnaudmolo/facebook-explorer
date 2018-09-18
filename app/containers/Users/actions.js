/*
 *
 * Users actions
 *
 */

import {
  REQUEST_USERS,
  LOAD_USERS,
  REQUEST_USERS_ERROR,
  REQUEST_USER,
  LOAD_USER,
} from './constants';

export function requestUsers() {
  return {
    type: REQUEST_USERS,
  };
}

export function requestUser(userId) {
  return {
    type: REQUEST_USER,
    payload: userId,
  };
}

export function loadedUsers(users) {
  return {
    type: LOAD_USERS,
    payload: users,
  };
}

export function loadedUser(users) {
  return {
    type: LOAD_USER,
    payload: users,
  };
}

export function requestUsersError(err) {
  console.error(err);
  return {
    type: REQUEST_USERS_ERROR,
  };
}
