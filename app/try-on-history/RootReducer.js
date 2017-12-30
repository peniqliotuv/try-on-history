import { combineReducers } from 'redux';
import auth from './src/reducers/AuthReducer';
import navigation from './src/reducers/NavigationReducer';
import item from './src/reducers/ItemReducer';

export default combineReducers({ auth, navigation, item });
