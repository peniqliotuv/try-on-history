import { StackNavigator } from 'react-navigation';
import LoginNavigator from './src/navigation/LoginNavigator';
// import MainNavigator from './src/navigation/MainNavigator';

const AppNavigator = StackNavigator({
  Login: { screen: LoginNavigator },
  // Main: { screen: MainNavigator },
}, {
  headerMode: 'none',
  initialRouteName: 'Login',
});

export default AppNavigator
