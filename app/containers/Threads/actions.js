/*
 *
 * Threads actions
 *
 */

import {
  REQUEST_THREADS,
  REQUEST_THREAD,
  LOAD_THREADS,
  LOAD_THREAD,
  REQUEST_THREADS_ERROR,
} from './constants';

export function requestThreads() {
  return {
    type: REQUEST_THREADS,
  };
}

export function requestThread(threadId) {
  return {
    type: REQUEST_THREAD,
    payload: threadId,
  };
}

export function loadedThreads(threads) {
  return {
    type: LOAD_THREADS,
    payload: threads,
  };
}

export function loadedThread(thread) {
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
