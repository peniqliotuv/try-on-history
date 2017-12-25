import { StackNavigator, NavigationActions } from 'react-navigation';
import LoginNavigator from './src/navigation/LoginNavigator';
// import MainNavigator from './src/navigation/MainNavigator';

const AppNavigator = StackNavigator({
  Login: { screen: LoginNavigator },
  // Main: { screen: MainNavigator },
}, {
  headerMode: 'none',
  initialRouteName: 'Login',
});

// Stupid workaround
const navigateOnce = (getStateForAction) => (action, state) => {
  const { type, routeName } = action;
  return (
    state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
  ) ? state : getStateForAction(action, state);
  // you might want to replace 'null' with 'state' if you're using redux (see comments below)
};

AppNavigator.router.getStateForAction = navigateOnce(AppNavigator.router.getStateForAction);
LoginNavigator.router.getStateForAction = navigateOnce(LoginNavigator.router.getStateForAction);

export default AppNavigator;
