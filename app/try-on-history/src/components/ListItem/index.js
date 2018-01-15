import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

class ListItem extends Component {

  static propTypes = {
    history: PropTypes.shape({
      productName: PropTypes.string,
      upc: PropTypes.string,
      datePurchased: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]),
      dateTriedOn: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]),
      purchased: PropTypes.bool,
    }).isRequired,
  };

  static defaultProps = {
    history: {},
  };

  animatedValue = new Animated.Value(0);
  isExpanded = false;

  animate = () => {
    console.log('Animating');
    this.isExpanded ? this.animatedValue.setValue(1) : this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: this.isExpanded ? 0 : 1,
        duration: 250,
        easing: Easing.linear,
      },
    ).start(() => this.isExpanded = !this.isExpanded);
  };

  render() {
    const containerStyles = StyleSheet.flatten([
      styles.container,
      {
        paddingTop: this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 40],
        }),
        paddingBottom: this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 40],
        }),
      },
    ]);
    return (
      <Animated.View
        style={containerStyles}
      >
        <TouchableOpacity
          onPress={() => this.animate()}
          activeOpacity={0.9}
        >
        <Text
          style={styles.productName}
          selectable={false}
          numberOfLines={1}
        >
          { this.props.history.productName || '' }
        </Text>
        <Text style={styles.date}>
          { (new Date(this.props.history.dateTriedOn).toLocaleDateString()) || '' }
        </Text>
      </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default ListItem;
