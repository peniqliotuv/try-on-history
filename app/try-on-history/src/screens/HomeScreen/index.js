import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Keyboard,
  Alert,
  Platform,
  BackHandler,
  Modal,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Permissions } from 'expo';
import { isEmpty } from 'lodash';
import { logout } from '../../actions/AuthActions';
import { itemLookup } from '../../actions/ItemActions';
import { getHistory } from '../../actions/HistoryActions';
import CameraComponent from '../../components/CameraComponent';
import ScrollComponent from '../../components/ScrollComponent';
import ModalPopup from '../../components/ModalPopup';
import styles from './styles';


class HomeScreen extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    reduxNavigationState: PropTypes.shape({
      index: PropTypes.number,
      routes: PropTypes.array,
    }).isRequired,
    itemData: PropTypes.shape({
      upc: PropTypes.string,
      productName: PropTypes.string,
      brand: PropTypes.string,
      lowestPrice: PropTypes.number,
      highestPrice: PropTypes.number,
      imageUrls: PropTypes.arrayOf(PropTypes.string),
      productDescription: PropTypes.string,
      fit: PropTypes.number,
      numReviews: PropTypes.number,
    }).isRequired,
    itemLookupError: PropTypes.string.isRequired,
    historyData: PropTypes.arrayOf(PropTypes.shape({
      upc: PropTypes.string,
      productName: PropTypes.string,
      dateTriedOn: PropTypes.string,
      datePurchased: PropTypes.string,
      purchased: PropTypes.bool,
    })).isRequired,
    historyError: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    itemLookup: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
  };

  state = {
    hasCameraPermissions: null,
    currentIndex: 0,
    isModalVisible: false,
  };

  componentWillMount() {
    Keyboard.dismiss();
    // Remove the other screens
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => true);
    }
    this.props.getHistory(this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.itemData) && isEmpty(this.props.itemData)) {
      Alert.alert(`Item found: ${nextProps.itemData.productName}!`);
    } else if (nextProps.itemLookupError && !this.props.itemLookupError) {
      Alert.alert(nextProps.itemLookupError);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  toggleModalVisibility = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    this.props.logout();
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Splash' }),
      ],
    }));
  };

  handleScroll = async (e, state, context) => {
    let { hasCameraPermissions } = this.state;
    if (state.index === 1) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      hasCameraPermissions = (status === 'granted');
    }
    this.setState({
      currentIndex: state.index,
      hasCameraPermissions,
    });
  };

  render() {
    return (
      <Swiper
        loop={false}
        horizontal={false}
        showsPagination={false}
        index={0}
        onMomentumScrollEnd={this.handleScroll}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <ScrollComponent
            user={this.props.user}
            handleLogout={this.handleLogout}
            historyData={this.props.historyData}
            toggleModalVisibility={this.toggleModalVisibility}
          />
          <Modal
            visible={this.state.isModalVisible}
            animationType='slide'
            onRequestClose={this.toggleModalVisibility}
            onDismiss={this.toggleModalVisibility}
            transparent
          >
            <ModalPopup productName='asdf' />
          </Modal>
        </View>
        <View style={styles.container}>
          {
            this.state.hasCameraPermissions ? (
              <CameraComponent
                itemLookup={this.props.itemLookup}
                token={this.props.token}
                upc={this.props.itemData.upc}
              />
            )
              : (<Text>
                  Camera Permissions not granted.
                </Text>)
          }
        </View>
      </Swiper>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  itemData: state.item.data,
  itemLookupError: state.item.error,
  historyData: state.history.data,
  historyError: state.history.error,
  reduxNavigationState: state.navigation,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  itemLookup: (barcode, token) => dispatch(itemLookup(barcode, token)),
  getHistory: (token) => dispatch(getHistory(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
