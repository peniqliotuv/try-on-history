import { handleActions } from 'redux-actions';
import { itemLookupSucceeded, itemLookupFailed } from '../actions/ItemActions';

const defaultState = {
  upc: '',
  productName: '',
  brand: '',
  lowestPrice: 0.0,
  highestPrice: 0.0,
  imageUrls: [],
  productDescription: '',
  fit: 0.0,
  numReviews: 0,
};

export default handleActions({
  [itemLookupSucceeded]: (state, action) => action.payload,
  [itemLookupFailed]: (state, action) => defaultState,
}, defaultState);
