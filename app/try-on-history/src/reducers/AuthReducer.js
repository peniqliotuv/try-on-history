import { handleActions } from 'redux-actions';
import { loginSucceeded, loginFailed } from '../actions/AuthActions';

const defaultState = {
  'user': {},
  'error': '',
  'token': '',
};


export default handleActions({
  [loginSucceeded]: (state, action) => {
    return {
      ...state,
      token: action.payload.token,
      user: action.payload.user,
    };
  }
}, defaultState);
