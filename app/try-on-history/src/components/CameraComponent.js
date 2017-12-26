import React from 'react';
import { View } from 'react-native';
import { Camera } from 'expo';

const CameraComponent = (type = Camera.Constants.Type.back) => {
  console.log(type);
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
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
