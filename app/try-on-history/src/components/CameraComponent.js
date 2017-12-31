import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner, Camera } from 'expo';

const CameraComponent = ({ itemLookup, token }) => {

  const handleBarCodeRead = (payload) => {
    itemLookup(payload.data, token);
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

CameraComponent.propTypes = {
  itemLookup: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default CameraComponent;
