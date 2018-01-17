import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native';
import styles from './styles';

const ModalPopup = ({ itemData }) => (
  <View
    style={styles.container}
  >
    <Text style={styles.productName}>{ itemData.productName }</Text>
    <Text>{ itemData.brand }</Text>
    <Text>{ itemData.upc }</Text>
  </View>
);

ModalPopup.propTypes = {
  itemData: PropTypes.shape({
    upc: PropTypes.string,
    productName: PropTypes.string,
    brand: PropTypes.string,
    lowestPrice: PropTypes.number,
    highestPrice: PropTypes.number,
    imageUrls: PropTypes.array,
    productDescription: PropTypes.string,
    fit: PropTypes.number,
  }).isRequired,
};

export default ModalPopup;

