import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import styles from './styles';
import {
  AsyncStorage,
  Image,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  loginWithAuthToken,
  setAuthToken,
  clearError,
} from '../../actions/AuthActions';

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

  imageSource = require('../../../assets/photo-camera.png');
  dimensions = Dimensions.get('window')

  render() {
    const buttonContainerStyles = StyleSheet.flatten([styles.buttonContainer, { width: this.dimensions.width }]);

    return (
      <View style={styles.container}>
        <Text style={styles.titleLight}>TRY ON</Text>
        <Text style={styles.title}>HISTORY</Text>
        <View style={styles.imageContainer}>
          <Image
            resizeMode={Image.resizeMode.contain}
            style={styles.image}
            source={this.imageSource}
          />
        </View>
        <View style={buttonContainerStyles}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({
              routeName: 'Login',
              params: {},
              action: NavigationActions.navigate({ routeName: 'SignUp' }),
            }))}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch) => ({
  loginWithAuthToken: (token) => dispatch(loginWithAuthToken(token)),
  setAuthToken: (token) => dispatch(setAuthToken(token)),
  clearError: () => dispatch(clearError()),
});


export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
