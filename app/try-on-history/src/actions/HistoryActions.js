import { createAction } from 'redux-actions';
import config from '../../config';

export const getHistorySucceeded = createAction('GET_HISTORY_SUCCEEDED');
export const getHistoryFailed = createAction('GET_HISTORY_FAILED');

export const getHistory = (token) => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${config.hostname}/api/history/`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.group('history')
      console.log(res.status);
      const json = await res.json();
      console.log(json);
      console.groupEnd();
      if (res.status === 200) {
        dispatch(getHistorySucceeded(json));
      } else {
        dispatch(getHistoryFailed());
      }
    } catch (e) {
      dispatch(getHistoryFailed(e));
    }
  };
};
