import { combineReducers } from 'redux';
import auth from './src/reducers/AuthReducer';
import navigation from './src/reducers/NavigationReducer';

export default combineReducers({ auth, navigation });
