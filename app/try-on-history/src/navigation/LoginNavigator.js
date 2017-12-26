import { StackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const screens = {
  SignUp: { screen: SignUpScreen },
  Login: { screen: LoginScreen },
};

const options = {
  initialRouteName: 'Login',
  headerMode: 'none',
  mode: 'modal',
};

const LoginNavigator = StackNavigator(screens, options);

export default LoginNavigator;
