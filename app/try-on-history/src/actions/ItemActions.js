import { createAction } from 'redux-actions';
import config from '../../config';
import { createPostOptions } from '../utils/ajax';

export const itemLookupSucceeded = createAction('ITEM_LOOKUP_SUCCEEDED');
export const itemLookupFailed = createAction('ITEM_LOOKUP_FAILED');

export const itemLookup = (barcode, token) => {
  console.log('itemLookup entered');
  return async (dispatch) => {
    try {
      const res = await fetch(`${config.hostname}/api/items/${barcode}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      const json = await res.json();
      if (res.status === 200) {
        dispatch(itemLookupSucceeded(json));
      } else {
        dispatch(itemLookupFailed());
      }
    } catch (e) {
      dispatch(itemLookupFailed(e));
    }
  };
};
