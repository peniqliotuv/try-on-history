import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import styled from 'styled-components/native';
import { signUp } from '../actions/AuthActions';

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

  state = {
    username: '',
    password: '',
    isLoading: false,
  };

  static propTypes = {
    signUp: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  };


  handleSignUp = (username, password) => {
    this.props.signUp(username, password);
  };

  render() {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      console.log('Rendering activity Indicator')
      return (
        <Container>
          <Text>Signing Up...</Text>
          <ActivityIndicator size='large' color="#0000ff"/>
        </Container>
      );
    } else if (!isEmpty(this.props.user)) {
      console.log('Rendering user details');
      return (
        <Container>
          <Text>SUCCESSFUL SIGNUP!</Text>
        </Container>
      )
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
          ref={input => this.passwordRef = input}
        />
        <TouchableOpacity
          onPress={() => this.handleSignUp(this.state.username, this.state.password)}>
          <Text>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
          <Text>GO BACK</Text>
        </TouchableOpacity>
      </Container>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    user: state.auth.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (username, password) => dispatch(signUp(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
