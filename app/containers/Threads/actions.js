/*
 *
 * Threads actions
 *
 */

import {
  REQUEST_THREADS,
  REQUEST_USER,
  LOAD_THREADS,
  LOAD_THREAD,
  REQUEST_THREADS_ERROR,
} from './constants';

export function requestThreads() {
  return {
    type: REQUEST_THREADS,
  };
}

export function requestUser(threadId) {
  return {
    type: REQUEST_USER,
    payload: threadId,
  };
}

export function loadedThreads(threads) {
  return {
    type: LOAD_THREADS,
    payload: threads,
  };
}

export function loadedUser(thread) {
  return {
    type: LOAD_THREAD,
    payload: thread,
  };
}

export function requestThreadsError(err) {
  console.error(err);
  return {
    type: REQUEST_THREADS_ERROR,
  };
}
