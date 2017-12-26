import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Image, View, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  loginWithAuthToken,
  setAuthToken,
  clearError,
} from '../actions/AuthActions';
import {
  StyledText,
  Container,
  StyledImage,
  StyledButton,
} from '../globals/styled-components';

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
    }
  }

  async componentWillReceiveProps(nextProps) {
    console.log('ComponentWillReceiveProps in Splash Screen');
    if (!isEmpty(nextProps.user)) {
      console.log('Navigating to Main Screen');
    } else if (nextProps.error && nextProps.error !== this.props.error) {
      console.log('Navigating to the Login Screen');
      await AsyncStorage.removeItem('token');
      this.props.clearError();
      this.props.navigation.navigate('Login');
    }
  }

  imageSource = require('~/assets/photo-camera.png');
  dimensions = Dimensions.get('window')

  render() {
    console.log('Rendering Splash Screen');
    return (
      <Container
        paddingTop={this.dimensions.height / 10}
        paddingLeft={this.dimensions.width / 10}
        paddingRight={this.dimensions.width / 10}
      >
        <StyledText
          fontSize='56px'
          fontWeight='200'
          color='white'
        >
          TRY ON
        </StyledText>
        <StyledText
          fontSize='56px'
          color='white'
        >
          HISTORY
        </StyledText>
        <View
          position='absolute'
          height='100%'
          width='100%'
        >
          <StyledImage
            resizeMode={Image.resizeMode.contain}
            position='absolute'
            top='12.5%'
            left='-25%'
            source={this.imageSource}
          />
        </View>

        <Container
          position='absolute'
          flex='1'
          flexDirection='row'
          justifyContent='space-around'
          width={this.dimensions.width}
          bottom='10%'
        >
          <StyledButton
            width='35%'
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <StyledText>LOGIN</StyledText>
          </StyledButton>
          <StyledButton
            width='35%'
            onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({
              routeName: 'Login',
              params: {},
              action: NavigationActions.navigate({ routeName: 'SignUp' }),
            }))}
          >
            <StyledText>SIGN UP</StyledText>
          </StyledButton>
        </Container>
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
