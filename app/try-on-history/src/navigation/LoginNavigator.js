import { StackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const LoginNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  SignUp: { screen: SignUpScreen },
}, {
  initialRouteName: 'Login',
  headerMode: 'none',
});

export default LoginNavigator;
