import { StackNavigator, NavigationActions } from 'react-navigation';
import LoginNavigator from './src/navigation/LoginNavigator';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
// import MainNavigator from './src/navigation/MainNavigator';

const AppNavigator = StackNavigator({
  Login: { screen: LoginNavigator },
  Splash: { screen: SplashScreen },
  Home: { screen: HomeScreen },
  // Main: { screen: MainNavigator },
}, {
  headerMode: 'none',
  initialRouteName: 'Splash',
});

// Workaround to make sure that we don't get duplicate screens with nested navigators
const navigateOnce = (getStateForAction) => (action, state) => {
  const { type, routeName } = action;
  return (
    state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
  ) ? state : getStateForAction(action, state);
};

AppNavigator.router.getStateForAction = navigateOnce(AppNavigator.router.getStateForAction);
LoginNavigator.router.getStateForAction = navigateOnce(LoginNavigator.router.getStateForAction);

export default AppNavigator;
