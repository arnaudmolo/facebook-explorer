import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { zipObj } from 'ramda';
import { loadedThreads, requestThreadsError } from './actions';
import { REQUEST_THREADS } from './constants';

const parse = zipObj([
  'id',
  'title',
  'is_still_participant',
  'status',
  'thread_type',
  'thread_path',
  'meta',
]);

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
}
