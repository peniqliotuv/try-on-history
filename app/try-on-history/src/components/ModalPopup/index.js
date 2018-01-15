import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';
import styles from './styles';

const ModalPopup = ({ productName }) => (
  <View
    style={styles.container}
  >
    <Text style={styles.productName}>{ productName }</Text>
  </View>
);

ModalPopup.propTypes = {
  productName: PropTypes.string.isRequired,
};

export default ModalPopup;

