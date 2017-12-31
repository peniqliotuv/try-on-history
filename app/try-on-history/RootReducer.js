import { combineReducers } from 'redux';
import auth from './src/reducers/AuthReducer';
import navigation from './src/reducers/NavigationReducer';
import item from './src/reducers/ItemReducer';
import history from './src/reducers/HistoryReducer';

export default combineReducers({ auth, navigation, item, history });
