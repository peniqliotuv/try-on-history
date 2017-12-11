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
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(
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

