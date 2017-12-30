import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Image, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  loginWithAuthToken,
  setAuthToken,
  clearError,
} from '../actions/AuthActions';
// import {
//   Text,
//   Container,
//   Image,
//   TouchableOpacity,
// } from '../globals/styled-components';

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
      this.props.navigation.navigate('Home');
    } else if (nextProps.error && nextProps.error !== this.props.error) {
      console.log('Navigating to the Login Screen');
      await AsyncStorage.removeItem('token');
      this.props.clearError();
      this.props.navigation.navigate('Login');
    }
  }

  imageSource = require('../../assets/photo-camera.png');
  dimensions = Dimensions.get('window')

  render() {
    console.log('Rendering Splash Screen');
    return (
      <View
        style={{
          paddingTop: this.dimensions.height / 10,
          paddingLeft: this.dimensions.width / 10,
          paddingRight: this.dimensions.width / 10,
        }}
      >
        <Text
          style={{
            fontSize: 56,
            fontWeight: '200',
            color: 'white',
          }}
        >
          TRY ON
        </Text>
        <Text
          style={{
            fontSize: 56,
            color: 'white',
          }}
        >
          HISTORY
        </Text>
        <View
          style={{
            flex: 1,
            position: 'absolute',
          }}
        >
          <Image
            resizeMode={Image.resizeMode.contain}
            style={{
              position:'absolute',
              top:12.5,
              left:25,
            }}
            source={this.imageSource}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: this.dimensions.width,
            bottom: 10,
          }}

        >
          <TouchableOpacity
            style={{width: 35}}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 35 }}
            onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({
              routeName: 'Login',
              params: {},
              action: NavigationActions.navigate({ routeName: 'SignUp' }),
            }))}
          >
            <Text>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
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
