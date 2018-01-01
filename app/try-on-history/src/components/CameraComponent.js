import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo';

const propTypes = {
  itemLookup: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  upc: PropTypes.string,
};

const CameraComponent = ({ itemLookup, token, upc }) => {

  const handleBarCodeRead = (payload) => {
    if (payload.data !== upc) {
      itemLookup(payload.data, token);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner
        style={{ height: 400, width: 400 }}
        onBarCodeRead={handleBarCodeRead}
      />
    </View>
  );
};

CameraComponent.propTypes = propTypes;

export default CameraComponent;
