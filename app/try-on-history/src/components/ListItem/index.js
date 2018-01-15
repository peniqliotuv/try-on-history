import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
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
    toggleModalVisibility: PropTypes.func.isRequired,
  };

  static defaultProps = {
    history: {},
  };

  parseDate = (dateString) => (new Date(dateString).toLocaleDateString()) || '';

  // animatedValue = new Animated.Value(0);
  // isExpanded = false;

  // animate = () => {
  //   console.log('Animating');
  //   this.isExpanded ? this.animatedValue.setValue(1) : this.animatedValue.setValue(0);
  //   Animated.timing(
  //     this.animatedValue,
  //     {
  //       toValue: this.isExpanded ? 0 : 1,
  //       duration: 250,
  //       easing: Easing.linear,
  //     },
  //   ).start(() => this.isExpanded = !this.isExpanded);
  // };

  render() {
    // const containerStyles = StyleSheet.flatten([
    //   styles.container,
    //   {
    //     paddingBottom: this.animatedValue.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [10, 80],
    //     }),
    //     elevation: this.animatedValue.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 3],
    //     }),
    //   },
    // ]);

    return (
      <TouchableOpacity
        onPress={this.props.toggleModalVisibility}
        hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }}
        style={styles.container}
        activeOpacity={0.9}
      >
        <Text
          style={styles.productName}
          selectable={false}
          numberOfLines={1}
        >
          { this.props.history.productName || '' }
        </Text>
        <Text
          style={styles.date}
        >
          { this.parseDate(this.props.history.dateTriedOn) }
        </Text>
      </TouchableOpacity>
    );
  }
}

export default ListItem;
