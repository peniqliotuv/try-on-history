import React, { Component, Fragment } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from 'react-native';
import { Text } from '../globals/styled-components';
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
    // loginWithAuthToken: PropTypes.func.isRequired,
    // setAuthToken: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
    isLoading: false,
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

  // async componentWillMount() {
  //   console.log('Getting Token');
  //   const token = JSON.parse(await AsyncStorage.getItem('token'));
  //   if (token) {
  //     this.props.setAuthToken(token);
  //     this.props.loginWithAuthToken(token);
  //   }
  //   console.log('Finished componentWillMount')
  // }

  async componentWillReceiveProps(nextProps) {
    // If a JWT was successfully returned from the server
    console.log(nextProps);
    if (nextProps.token && nextProps.token !== this.props.token) {
      try {
        console.log('Setting New Token')
        await AsyncStorage.setItem('token', JSON.stringify(nextProps.token));
      } catch (e) {
        console.error('Error Saving the token');
      }
    } else if (nextProps.error) {
      Alert.alert(
        'Invalid Login',
        nextProps.error,
      );
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    console.log('unmounting')
  }

  renderContentBody = () => {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      return (
          <ActivityIndicator size='large' color="#0000ff"/>
      );
    } else {
      return (
        <View>
          <Text>Not Logged In!</Text>
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
      // Change this to redirect later
      const { username, user_id } = this.props.user;
      console.log('Rendering user details');
      return (
        <Container>
          <Text fontSize='24px'>Success! {this.props.token}</Text>
          <Text>Username: {username}</Text>
          <Text>User ID: {user_id}</Text>
          <TouchableOpacity
            onPress={() => this.handleLogout()}
          >
            <Text>LOGOUT CURRENT USER</Text>
          </TouchableOpacity>
        </Container>
      )
    }

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
    // loginWithAuthToken: (token) => dispatch(loginWithAuthToken(token)),
    // setAuthToken: (token) => dispatch(setAuthToken(token)),
  };
}

// The "pure" parameter allows us to prevent being stuck in an infinitely loading state
// if the user provides incorrect credentials twice.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(LoginScreen);
