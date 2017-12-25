import { handleActions } from 'redux-actions';
import {
  loginSucceeded,
  loginFailed,
  setAuthToken,
  signUpFailed,
  logout,
  clearError,
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
      error: action.payload.message,
    };
  },
  [setAuthToken]: (state, action) => {
    return {
      ...state,
      token: action.payload,
    };
  },
  [signUpFailed]: (state, action) => {
    return {
      ...state,
      error: action.payload.message,
    };
  },
  [clearError]: (state, action) => {
    return {
      ...state,
      error: '',
    };
  },
  [logout]: (state, action) => defaultState,
}, defaultState);
