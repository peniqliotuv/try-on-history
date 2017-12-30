import React from 'react';
import { View, Alert } from 'react-native';
import { Camera } from 'expo';

const CameraComponent = ({type = Camera.Constants.Type.back, itemLookup}) => {

  const handleBarCodeRead = (payload) => {
    const { data, type } = payload;
    console.log(payload.data);
    console.log('Barcoade was read');
    itemLookup(data);
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onBarCodeRead={handleBarCodeRead}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>

        </View>
      </Camera>
    </View>
  );
};

export default CameraComponent;
