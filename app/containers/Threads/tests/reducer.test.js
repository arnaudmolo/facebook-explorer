import { fromJS } from 'immutable';
import threadsReducer from '../reducer';

describe('threadsReducer', () => {
  it('returns the initial state', () => {
    expect(threadsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
