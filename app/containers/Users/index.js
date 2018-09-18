/**
 *
 * Users
 *
 */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { lifecycle } from 'recompose';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectUsers, {
  makeSelectOwnUser,
  isLoadingSelector,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import { requestUsers, requestUser } from './actions';

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  own: makeSelectOwnUser(),
  loading: isLoadingSelector,
});

const withConnect = connect(
  mapStateToProps,
  { requestUsers, requestUser },
);

const withReducer = injectReducer({ key: 'users', reducer });
const withSaga = injectSaga({ key: 'users', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  lifecycle({
    componentWillMount() {
      if (!this.props.loading) {
        this.props.requestUsers();
      }
    },
  }),
);
