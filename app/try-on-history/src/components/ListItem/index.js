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
    handleItemLookup: PropTypes.func.isRequired,
  };

  static defaultProps = {
    history: {},
  };

  parseDate = (dateString) => (new Date(dateString).toLocaleDateString()) || '';

  handlePress = (upc) => {
    console.log(upc);
    console.log('pressed')
    this.props.toggleModalVisibility();
    this.props.handleItemLookup(upc);
  };


  render() {
    const { history } = this.props;
    return (
      <TouchableOpacity
        hitSlop={{ top: 10, left: 20, bottom: 10, right: 20 }}
        onPress={() => this.handlePress(history.upc)}
        style={styles.container}
        activeOpacity={0.75}
      >
        <Text
          style={styles.productName}
          selectable={false}
          numberOfLines={1}
        >
          { history.productName || '' }
        </Text>
        <Text
          style={styles.date}
        >
          { this.parseDate(history.dateTriedOn) }
        </Text>
      </TouchableOpacity>
    );
  }
}

export default ListItem;
