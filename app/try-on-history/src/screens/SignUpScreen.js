import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import styled from 'styled-components/native';
import { signUp, clearError } from '../actions/AuthActions';

const Container = styled.View`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputField = styled.TextInput`
  border: 1px solid black;
  margin: 20px;
  height: 40px;
  font-size: 20px;
`;


class SignUpScreen extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    reduxNavigationState: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.array.isRequired,
    }),
  };

  state = {
    username: '',
    password: '',
    isLoading: false,
  };

  async componentWillReceiveProps(nextProps) {
    // If a JWT was successfully returned from the server
    console.log(nextProps);
    const { routes, index } = nextProps.reduxNavigationState;
    if (nextProps.token && nextProps.token !== this.props.token) {
      try {
        console.log('Setting New Token');
        await AsyncStorage.setItem('token', JSON.stringify(nextProps.token));
      } catch (e) {
        console.error('Error Saving the token');
      }
    } else if (nextProps.error && routes[index].routeName === 'SignUp') {
      Alert.alert(
        'Invalid Signup',
        nextProps.error,
      );
      this.setState({ isLoading: false });
    }
  }


  handleSignUp = (username, password) => {
    this.props.signUp(username, password);
  };

  handleNavigateToLogin = () => {
    this.props.clearError();
    this.props.navigation.dispatch(NavigationActions.back());
  };

  render() {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      console.log('Rendering activity Indicator')
      return (
        <Container>
          <Text>Signing Up...</Text>
          <ActivityIndicator size='large' color='#0000ff'/>
        </Container>
      );
    } else if (!isEmpty(this.props.user)) {
      console.log('Rendering user details');
      return (
        <Container>
          <Text>SUCCESSFUL SIGNUP!</Text>
        </Container>
      );
    }

    return (
      <Container>
        <Text>SignUp Screen</Text>
        <InputField
          placeholder='Username'
          autocorrect={false}
          autoCapitalize='none'
          placeholderTextColor='black'
          onChangeText={(text) => this.setState({ username: text })}
          onSubmitEditing={() => this.passwordRef.focus()}
        />
        <InputField
          placeholder='Password'
          autocorrect={false}
          autoCapitalize='none'
          placeholderTextColor='black'
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry
          ref={(input) => this.passwordRef = input}
        />
        <TouchableOpacity
          onPress={() => this.handleSignUp(this.state.username, this.state.password)}
        >
          <Text>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleNavigateToLogin}
        >
          <Text>GO BACK</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const { routes, index } = state.navigation;
  return {
    error: state.auth.error,
    user: state.auth.user,
    token: state.auth.token,
    reduxNavigationState: routes[index],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (username, password) => dispatch(signUp(username, password)),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
