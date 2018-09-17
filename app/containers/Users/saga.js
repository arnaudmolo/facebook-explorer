import { takeLatest, call, put } from 'redux-saga/effects';
import { zipObj } from 'ramda';
import request from 'utils/request';
import { REQUEST_USERS } from './constants';
import { loadedUsers, requestUsersError } from './actions';

const zip = zipObj([
  'id',
  'name',
  'fb_id',
  'relation_id',
  'date',
  'friendship',
]);

export function* getUsers() {
  const requestURL = '//127.0.0.1:5002/users';
  try {
    // Call our request helper (see 'utils/request')
    const users = yield call(request, requestURL);
    yield put(loadedUsers(users.map(zip)));
  } catch (err) {
    yield put(requestUsersError(err));
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(REQUEST_USERS, getUsers);
}
