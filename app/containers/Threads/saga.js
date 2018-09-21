import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { zipObj } from 'ramda';
import { loadedThreads, requestThreadsError, loadedThread } from './actions';
import { REQUEST_THREADS, REQUEST_THREAD } from './constants';

const parse = zipObj([
  'id',
  'title',
  'is_still_participant',
  'status',
  'thread_type',
  'thread_path',
  'meta',
  'users',
  'messages',
]);

export function* getThread(action) {
  const requestURL = `//127.0.0.1:5002/threads/${action.payload}`;
  try {
    const thread = yield call(request, requestURL);
    yield put(loadedThread(parse(thread)));
  } catch (e) {
    console.error(e);
  }
}

export function* getThreads() {
  const requestURL = '//127.0.0.1:5002/threads?count=0';
  try {
    // Call our request helper (see 'utils/request')
    const threads = yield call(request, requestURL);
    yield put(loadedThreads(threads.map(parse)));
  } catch (err) {
    yield put(requestThreadsError(err));
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(REQUEST_THREADS, getThreads);
  yield takeLatest(REQUEST_THREAD, getThread);
}
