import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './RootReducer';
import AppNavigator from './AppNavigator';

const preloadedState = {
  auth: {
    user: {},
    error: '',
    token: '',
  }
}


export const store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(logger),
  ),
);

const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
)

export default App;

