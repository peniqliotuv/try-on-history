import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  Text,
  TextInput,
  Platform,
  BackHandler,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { signUp, clearError } from '../../actions/AuthActions';
import styles from './styles';
import colors from '../../globals/colors';

class SignUpScreen extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    reduxNavigationState: PropTypes.shape({
      index: PropTypes.number,
      routes: PropTypes.array,
    }).isRequired,
  };

  state = {
    username: '',
    password: '',
    email: '',
    isLoading: false,
  };

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.dispatch(NavigationActions.back());
        return true;
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    // If a JWT was successfully returned from the server
    const { routes, index } = nextProps.reduxNavigationState;
    if (nextProps.token && nextProps.token !== this.props.token) {
      try {
        console.log('Setting New Token');
        await AsyncStorage.setItem('token', JSON.stringify(nextProps.token));
      } catch (e) {
        console.error('Error Saving the token');
      }
    } else if (nextProps.error && routes[index].routeName === 'SignUp') {
      Alert.alert(
        'Invalid Signup',
        nextProps.error,
      );
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleSignUp = (username, password) => {
    this.props.signUp(username, password);
  };

  handleNavigateToLogin = () => {
    this.props.clearError();
    this.props.navigation.dispatch(NavigationActions.back());
  };

  render() {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      return (
        <View>
          <Text>Signing Up...</Text>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      );
    } else if (!isEmpty(this.props.user)) {
      return (
        <View>
          <Text>SUCCESSFUL SIGNUP!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLight}>TRY ON</Text>
          <Text style={styles.title}>HISTORY</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            autoFocus
            style={styles.inputField}
            underlineColorAndroid={colors.cobaltBlue}
            placeholder='USERNAME'
            autocorrect={false}
            autoCapitalize='none'
            placeholderTextColor={colors.darkGrey}
            selectionColor={colors.cobaltBlue}
            onChangeText={(text) => this.setState({ username: text })}
            onSubmitEditing={() => this.passwordRef.focus()}
          />
          <TextInput
            style={styles.inputField}
            underlineColorAndroid={colors.cobaltBlue}
            placeholder='PASSWORD'
            autocorrect={false}
            autoCapitalize='none'
            placeholderTextColor={colors.darkGrey}
            selectionColor={colors.cobaltBlue}
            onChangeText={(text) => this.setState({ password: text })}
            onSubmitEditing={() => this.emailRef.focus()}
            secureTextEntry
            ref={(input) => this.passwordRef = input}
          />
          <TextInput
            style={styles.inputField}
            underlineColorAndroid={colors.cobaltBlue}
            placeholder='EMAIL'
            autocorrect={false}
            keyboardType='email-address'
            autoCapitalize='none'
            placeholderTextColor={colors.darkGrey}
            selectionColor={colors.cobaltBlue}
            onChangeText={(text) => this.setState({ email: text })}
            ref={(input) => this.emailRef = input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => this.handleSignUp(this.state.username, this.state.password)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleNavigateToSignUp}
            style={styles.paddinglessButton}
          >
            <Text style={styles.paddinglessButtonText}>
              FORGOT MY PASSWORD
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { routes, index } = state.navigation;
  return {
    error: state.auth.error,
    user: state.auth.user,
    token: state.auth.token,
    reduxNavigationState: routes[index],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (username, password) => dispatch(signUp(username, password)),
    clearError: () => dispatch(clearError()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
