import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { login } from '../actions/AuthActions';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';


const Container = styled.View`
  margin: 20px;
`;

const InputField = styled.TextInput`
  border: 1px solid black;
  margin: 10px;
`


class LoginScreen extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
  }

  state = {
    username: '',
    password: '',
    loading: false,
  }

  handleLogin = (email, password) => {
    this.props.login(email, password);
    this.setState({ loading: true });
  }

  render() {

    if (!isEmpty(this.props.user)) {
      // TODO
      return (
        <Container>
          <Text>Success! {this.props.token}</Text>
        </Container>
      )
    }

    return (
      <Container>
        <Text>Not Logged In!</Text>
        <InputField
          placeHolder='Username'
          autocorrect={false}
          autoCapitalize='none'
          placeHolderTextColor='black'
          onChangeText={(text) => this.setState({ username: text })}
          onSubmitEditing={() => this.passwordRef.focus()}
        />
        <InputField
          placeHolder='Password'
          autocorrect={false}
          autoCapitalize='none'
          placeHolderTextColor='black'
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry
          ref={input => this.passwordRef = input}
        />
        <TouchableOpacity
          onPress={() => this.handleLogin(this.state.username, this.state.password)}
        >
          <Text>SUBMIT</Text>
        </TouchableOpacity>
      </Container>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username, password)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
