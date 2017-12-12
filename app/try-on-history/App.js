import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
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
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
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

