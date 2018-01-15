import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
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
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { Container } from '../../globals/styled-components';
import {
  login,
  clearError,
} from '../../actions/AuthActions';
import styles from './styles';
import colors from '../../globals/colors';

class LoginScreen extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    reduxNavigationState: PropTypes.shape({
      index: PropTypes.number,
      routes: PropTypes.array,
    }).isRequired,
    login: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    password: '',
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
    // console.log(nextProps);
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

    if (!isEmpty(nextProps.user)) {
      // this.props.navigation.navigate('Home');
      // this.props.navigation.dispatch(NavigationActions.navigate({
      //         routeName: 'Home',
      //         params: {},
      //         // action: NavigationActions.navigate({ routeName: 'SignUp' }),
      //       }));
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleLogin = (email, password) => {
    this.setState({ isLoading: true }, () => {
      this.props.login(email, password);
      Keyboard.dismiss();
    });
  };

  handleNavigateToSignUp = () => {
    this.props.navigation.navigate('SignUp');
    this.props.clearError();
  };

  renderContentBody = () => {
    if (this.state.isLoading && isEmpty(this.props.user)) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#0000ff' />
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
            placeholderTextColor={colors.lightGrey}
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
            placeholderTextColor={colors.lightGrey}
            selectionColor={colors.cobaltBlue}
            onChangeText={(text) => this.setState({ password: text })}
            secureTextEntry
            ref={(input) => this.passwordRef = input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => this.handleLogin(this.state.username, this.state.password)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
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

  render() {
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
