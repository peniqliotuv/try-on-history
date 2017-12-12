import { handleActions } from 'redux-actions';
import {
  loginSucceeded,
  loginFailed,
  setAuthToken,
} from '../actions/AuthActions';

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
  },
  [loginFailed]: (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  },
  [setAuthToken]: (state, action) => {
    return {
      ...state,
      token: action.payload,
    };
  },
}, defaultState);
