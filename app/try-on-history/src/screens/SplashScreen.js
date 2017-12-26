import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  loginWithAuthToken,
  setAuthToken,
  clearError,
} from '../actions/AuthActions';
import { Text, Container } from '../globals/styled-components';

class SplashScreen extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    setAuthToken: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    loginWithAuthToken: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    console.log('ComponentWillMount in Splash Screen');
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    if (token) {
      console.log('Retrieving Token from AsyncStorage');
      this.props.setAuthToken(token);
      this.props.loginWithAuthToken(token);
    } else {
      console.log('Token was not received, navigating to login screen');
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('ComponentWillReceiveProps in Splash Screen');
    console.log(process.env.NODE_ENV);
    if (!isEmpty(nextProps.user)) {
      console.log('Navigating to Main Screen');
    } else if (nextProps.error && nextProps.error !== this.props.error) {
      console.log('Navigating to the Login Screen');
      this.props.clearError();
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    console.log('Rendering Splash Screen');
    return (
      <Container>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
        <Text>Splash Screen</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginWithAuthToken: (token) => dispatch(loginWithAuthToken(token)),
    setAuthToken: (token) => dispatch(setAuthToken(token)),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
