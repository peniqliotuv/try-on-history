import { createAction } from 'redux-actions';
import config from '~/config';

export const loginSucceeded = createAction('LOGIN_SUCCEEDED');
export const loginFailed = createAction('LOGIN_FAILED');

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
      console.log(res.status)
      if (res.status === 200) {

      } else if (json.non_field_errors) {
        // Invalid username and password
        dispatch(loginFailed(json.non_field_errors[0]));
      } else {
        dispatch(loginFailed('Must provide username and password'));
      }
    } catch (e) {
      // res.json failed

    }



  }
}
