import { handleActions } from 'redux-actions';
import { itemLookupSucceeded, itemLookupFailed } from '../actions/ItemActions';

const defaultState = {
  data: {},
  error: '',
};

export default handleActions({
  [itemLookupSucceeded]: (state, action) => {
    return  {
      ...state,
      data: {
        upc: action.payload.upc,
        productName: action.payload.product_name,
        brand: action.payload.brand,
        lowestPrice: action.payload.lowest_price,
        highestPrice: action.payload.highest_price,
        imageUrls: action.payload.image_urls,
        productDescription: action.payload.product_description,
        fit: action.payload.fit,
        numReviews: action.payload.numReviews,
      },
    };
  },
  [itemLookupFailed]: (state, action) => {
    return {
      ...defaultState,
      error: 'Item Lookup Failed',
    };
  },
}, defaultState);
