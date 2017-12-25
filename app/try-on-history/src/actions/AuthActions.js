import { createAction } from 'redux-actions';
import config from '~/config';
import jwtDecode from 'jwt-decode';
import { createPostOptions } from '../utils/ajax';

export const loginSucceeded = createAction('LOGIN_SUCCEEDED');
export const loginFailed = createAction('LOGIN_FAILED');
export const setAuthToken = createAction('SET_AUTH_TOKEN');
export const signUpFailed = createAction('SIGNUP_FAILED');
export const clearError = createAction('CLEAR_ERROR');
export const logout = createAction('LOGOUT');

export const login = (username, password) => {
  return async (dispatch) => {
    const options = createPostOptions({ username, password });
    const res = await fetch(`${config.hostname}/api/jwt-auth/`, options);

    try {
      const json = await res.json();
      if (res.status === 200) {
        const { token } = json;
        const payload = { user: jwtDecode(token), token };
        dispatch(loginSucceeded(payload));
      } else if (json.non_field_errors) {
        // Invalid username and password
        dispatch(loginFailed(new Error(json.non_field_errors[0])));
      } else {
        dispatch(loginFailed(new Error('Must provide username and password')));
      }
    } catch (e) {
      // res.json failed
    }
  };
};

// Call this if app is launching and we only have the auth token, not the user instanc
export const loginWithAuthToken = (token) => {
  return async (dispatch) => {
    const options = createPostOptions({ token });
    let res = await fetch(`${config.hostname}/api/jwt-auth-verify/`, options);
    if (res.status === 200) {
      const payload = { user: jwtDecode(token), token };
      dispatch(loginSucceeded(payload));
    } else {
      res = await fetch(`${config.hostname}/api/jwt-auth-refresh/`, options);
      try {
        console.log(res.status);
        const { token: newToken } = await res.json();
        const payload = { user: jwtDecode(newToken), token: newToken };
        dispatch(loginSucceeded(payload));
      } catch (e) {
        dispatch(loginFailed(e));
      }
    }
  };
};


export const signUp = (username, password) => {
  return async (dispatch) => {
    const options = createPostOptions({ username, password });
    const res = await fetch(`${config.hostname}/api/users/`, options);
    try {
      const json = await res.json();
      if (res.status === 201) {
        // need to make the server return the user object as well
        const { token } = json;
        const payload = { user: jwtDecode(token), token };
        dispatch(loginSucceeded(payload));
      } else {
        dispatch(signUpFailed(new Error(json.detail)));
      }
    } catch (e) {
      console.error(e);
      // ??
    }
  };
};
