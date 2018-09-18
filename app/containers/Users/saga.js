import { takeLatest, call, put } from 'redux-saga/effects';
import { zipObj } from 'ramda';
import { compose } from 'redux';
import request from 'utils/request';
import { REQUEST_USERS, REQUEST_USER } from './constants';
import { loadedUsers, requestUsersError, loadedUser } from './actions';

const zip = zipObj([
  'id',
  'name',
  'fb_id',
  'relation_id',
  'date',
  'friendship',
]);

const parse = compose(
  user => ({
    ...user,
    name: decodeURIComponent(escape(user.name)),
  }),
  zip,
);

export function* getUser(action) {
  const requestURL = `//127.0.0.1:5002/users/${action.payload}`;
  try {
    yield put(
      loadedUser(
        compose(
          user => ({
            ...user,
            threads: user.threads.map(
              compose(
                thread => ({
                  ...thread,
                  messages: thread.messages.map(
                    zipObj(['id', 'thread', 'message', 'date', 'user']),
                  ),
                }),
                zipObj([
                  'id',
                  'title',
                  'is_still_participant',
                  'status',
                  'thread_type',
                  'thread_path',
                  'meta',
                  'messages',
                ]),
              ),
            ),
          }),
          zipObj(['id', 'name', 'threads']),
        )(yield call(request, requestURL)),
      ),
    );
  } catch (e) {
    console.error(e);
  }
}
export function* getUsers() {
  const requestURL = '//127.0.0.1:5002/users';
  try {
    // Call our request helper (see 'utils/request')
    const users = yield call(request, requestURL);
    yield put(loadedUsers(users.map(parse)));
  } catch (err) {
    yield put(requestUsersError(err));
  }
}

let once = false;
// Individual exports for testing
export default function* defaultSaga() {
  if (once) {
    return;
  }
  once = true;
  // See example in containers/HomePage/saga.js
  yield takeLatest(REQUEST_USERS, getUsers);
  yield takeLatest(REQUEST_USER, getUser);
}
