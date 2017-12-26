import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { addNavigationHelpers } from 'react-navigation';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './RootReducer';
import AppNavigator from './AppNavigator';

const preloadedState = {
  auth: {
    user: {},
    error: '',
    token: '',
  },
};

export const store = createStore(
  rootReducer,
  preloadedState,
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
    applyMiddleware(thunk),
    applyMiddleware(logger),
  ),
);

class Root extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation,
        })}
      />
    );
  }
}

// Overwrite the navigation prop with our redux store's navigation
const RootWithState = connect((state) => ({ navigation: state.navigation }))(Root);

const App = () => (
  <Provider store={store}>
    <RootWithState />
  </Provider>
)

export default App;
