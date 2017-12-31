import { handleActions } from 'redux-actions';
import { getHistorySucceeded, getHistoryFailed } from '../actions/HistoryActions';

const defaultState = {
  data: [],
  error: '',
};

export default handleActions({
  [getHistorySucceeded]: (state, action) => {
    return {
      ...state,
      data: action.payload.map(item => ({
        productName: item.product_name,
        upc: item.upc,
        datePurchased: item.date_purchased,
        dateTriedOn: item.date_tried_on,
        purchased: item.purchased,
      })),
    };
  },
  [getHistoryFailed]: (state, action) => {
    return {
      data: [],
      error: 'Item Lookup Failed',
    };
  },
}, defaultState);
