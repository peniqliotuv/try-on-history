import { createAction } from 'redux-actions';
import config from '~/config';
import jwtDecode from 'jwt-decode';

export const loginSucceeded = createAction('LOGIN_SUCCEEDED');
export const loginFailed = createAction('LOGIN_FAILED');
export const setAuthToken = createAction('SET_AUTH_TOKEN');

export const login = (username, password) => {
  return async (dispatch) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };


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



  }
}
