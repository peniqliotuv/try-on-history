import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { TextField } from '../globals/styled-components';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { login, loginWithAuthToken, setAuthToken, logout } from '../actions/AuthActions';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import colors from '../globals/colors';


const Container = styled.View`
  padding: 20px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  background-color: ${colors.cobaltBlue};
`;

const InputField = styled.TextInput`
  border: 1px solid ${colors.white};
  margin: 20px;
  height: 40px;
  font-size: 20px;
`;


class LoginScreen extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    loginWithAuthToken: PropTypes.func.isRequired,
    setAuthToken: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
    isLoading: true,
  };

  handleLogin = (email, password) => {
    this.setState({ isLoading: true }, () => {
      this.props.login(email, password);
    })
  };

  handleLogout = () => {
    this.setState({ isLoading: false }, () => {
      this.props.logout();
    });
  };

  async componentWillMount() {
    console.log('Getting Token');
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    if (token) {
      this.props.setAuthToken(token);
      this.props.loginWithAuthToken(token);
    }
    console.log('Finished componentWillMount')
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.token && nextProps.token !== this.props.token) {
      try {
        console.log('Setting New Token')
        await AsyncStorage.setItem('token', JSON.stringify(nextProps.token));
      } catch (e) {
        console.error('Error Saving the token');
      }
    } else if (nextProps.error && nextProps.error !== this.props.error) {
      this.setState({ isLoading: false });
    }
  }

  renderContentBody = () => {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      console.log('Rendering activity Indicator')
      return (
          <ActivityIndicator size='large' color="#0000ff"/>
      );
    } else {
      return (
        <View>
          <TextField>Not Logged In!</TextField>
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
            onPress={() => this.handleLogin(this.state.username, this.state.password)}
          >
            <Text>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}
          >
            <Text>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      );

    }
  }

  render() {
    if (!isEmpty(this.props.user)) {
      // If the user is logged in
      const { username, user_id } = this.props.user;
      console.log('Rendering user details');
      return (
        <Container>
          <TextField fontSize='24px'>Success! {this.props.token}</TextField>
          <TextField>Username: {username}</TextField>
          <TextField>User ID: {user_id}</TextField>
          <TouchableOpacity
            onPress={() => this.handleLogout()}
          >
            <TextField>LOGOUT</TextField>
          </TouchableOpacity>
        </Container>
      )
    }

    console.log('Rendering login screen')
    return (
      <Container>
        { this.renderContentBody() }
      </Container>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
    token: state.auth.token,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username, password)),
    logout: () => dispatch(logout()),
    loginWithAuthToken: (token) => dispatch(loginWithAuthToken(token)),
    setAuthToken: (token) => dispatch(setAuthToken(token)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
