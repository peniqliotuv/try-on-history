import { StackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';

const screens = {
  Splash: { screen: SplashScreen },
  Login: { screen: LoginScreen },
  SignUp: { screen: SignUpScreen },
};

const options = {
  initialRouteName: 'Login',
  headerMode: 'none',
  mode: 'modal',
  // navigationOptions: {
  //   headerTintColor: 'red',
  // }
};

const LoginNavigator = StackNavigator(screens, options);

export default LoginNavigator;
