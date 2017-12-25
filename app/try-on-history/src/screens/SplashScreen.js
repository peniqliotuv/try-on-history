import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { loginWithAuthToken, setAuthToken } from '../actions/AuthActions';
import { Text, Container } from '../globals/styled-components';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

class SplashScreen extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    loginWithAuthToken: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    setAuthToken: PropTypes.func.isRequired,
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

  componentWillReceiveProps(nextProps, nextState) {
    if (!isEmpty(nextProps.user)) {
      console.log('Navigating to Main Screen');
    } else if (nextProps.error && nextProps.error !== this.props.error) {
      console.log('Navigating to the Login Screen');
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <Container>
        <Text>Splash Screen</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
    token: state.auth.token,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginWithAuthToken: (token) => dispatch(loginWithAuthToken(token)),
    setAuthToken: (token) => dispatch(setAuthToken(token)),
  };
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(SplashScreen);
