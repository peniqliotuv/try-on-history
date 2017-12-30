import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { Permissions } from 'expo';
import { Container, StyledText } from '../globals/styled-components';
import CameraComponent from '../components/CameraComponent';
import { logout } from '../actions/AuthActions';
import { itemLookup } from '../actions/ItemActions';

class HomeScreen extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    item: PropTypes.shape({
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
    logout: PropTypes.func.isRequired,
    itemLookup: PropTypes.func.isRequired,
  };

  state = {
    hasCameraPermissions: null,
    currentIndex: 0,
  };


  handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    this.props.logout();
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Splash' }),
      ],
    }));
    // this.props.navigation.navigate('Splash');
  };

  handleScroll = async (e, state, context) => {
    let { hasCameraPermissions } = this.state;
    if (state.index === 1) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      console.log(status);
      hasCameraPermissions = status === 'granted';
    }
    this.setState({
      currentIndex: state.index,
      hasCameraPermissions,
    });
  };


  render() {
    const { username, user_id } = this.props.user;
    return (
      <Swiper
        loop={false}
        horizontal={false}
        showsPagination={false}
        index={0}
        onMomentumScrollEnd={this.handleScroll}
      >
        <Container>
          <StyledText fontSize='24px'>Success! {this.props.token}</StyledText>
          <StyledText>Username: {username}</StyledText>
          <StyledText>User ID: {user_id}</StyledText>
          <TouchableOpacity
            onPress={this.handleLogout}
          >
            <StyledText>LOGOUT CURRENT USER</StyledText>
          </TouchableOpacity>
          <View>
          </View>
        </Container>
        <Container
          backgroundColor='white'
        >
          {
            this.state.hasCameraPermissions ? (
              <CameraComponent
                itemLookup={this.props.itemLookup}
                token={this.props.token}
              />
            )
              : (<StyledText>
                Camera View
              </StyledText>)
          }
        </Container>
      </Swiper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
    token: state.auth.token,
    item: state.item,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    itemLookup: (barcode) => dispatch(itemLookup(barcode)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
