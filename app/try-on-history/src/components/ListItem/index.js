import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const ListItem = ({ history = {} }) => (
  <View style={styles.container}>
    <Text
      style={styles.productName}
      selectable={false}
      numberOfLines={1}
    >
      { history.productName || '' }
    </Text>
    <Text style={styles.date}>
      { (new Date(history.dateTriedOn).toLocaleDateString()) || '' }
    </Text>
  </View>
);

ListItem.propTypes = {
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

export default ListItem;
