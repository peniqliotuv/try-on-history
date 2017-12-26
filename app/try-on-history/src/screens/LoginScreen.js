import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { StyledText, Container } from '../globals/styled-components';
import {
  login,
  logout,
  clearError,
} from '../actions/AuthActions';
import colors from '../globals/colors';

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
    reduxNavigationState: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.array.isRequired,
    }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
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
    } else if (nextProps.error && routes[index].routeName === 'Login') {
      Alert.alert(
        'Invalid Login',
        nextProps.error,
      );
      this.setState({ isLoading: false });
    }
  }

  handleLogin = (email, password) => {
    this.setState({ isLoading: true }, () => {
      this.props.login(email, password);
    });
  };

  handleLogout = () => {
    this.setState({ isLoading: false }, () => {
      this.props.logout();
    });
  };

  handleNavigateToSignUp = () => {
    this.props.navigation.navigate('SignUp');
    this.props.clearError();
  }

  renderContentBody = () => {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      return (
        <ActivityIndicator size='large' color='#0000ff' />
      );
    }
    return (
      <View>
        <StyledText>Not Logged In!</StyledText>
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
          onPress={() => this.handleLogin(this.state.username, this.state.password)}
        >
          <StyledText>SUBMIT</StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleNavigateToSignUp}
        >
          <StyledText>SIGN UP</StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (!isEmpty(this.props.user)) {
      // If the user is logged in
      // Change this to redirect later
      const { username, user_id } = this.props.user;
      console.log('Rendering user details');
      return (
        <Container>
          <StyledText fontSize='24px'>Success! {this.props.token}</StyledText>
          <StyledText>Username: {username}</StyledText>
          <StyledText>User ID: {user_id}</StyledText>
          <TouchableOpacity
            onPress={() => this.handleLogout()}
          >
            <StyledText>LOGOUT CURRENT USER</StyledText>
          </TouchableOpacity>
        </Container>
      );
    }

    return (
      <Container>
        { this.renderContentBody() }
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  // Extract the current navigation state from the redux store
  const { routes, index } = state.navigation;
  return {
    user: state.auth.user,
    error: state.auth.error,
    token: state.auth.token,
    reduxNavigationState: routes[index],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username, password)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};

// The "pure" parameter allows us to prevent being stuck in an infinitely loading state
// if the user provides incorrect credentials twice.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(LoginScreen);
