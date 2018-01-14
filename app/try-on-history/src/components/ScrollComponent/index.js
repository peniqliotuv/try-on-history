import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import ListItem from '../ListItem';
import colors from '../../globals/colors';
import styles from './styles';

const ScrollComponent = ({ user, historyData, handleLogout }) => {
  return (
      <View style={styles.container}>
        <View
          style={styles.userContainer}
        >
          <Text>{user.username}</Text>
        </View>
        <View style={styles.historyContainer}>
          <FlatList
            style={styles.flatList}
            data={historyData}
            renderItem={({item}) => <ListItem history={item} />}
            keyExtractor={item => item.upc}
            listEmptyComponent={() => (
              new Array(10).map(i => <ListItem />)
            )}
          >
          </FlatList>
        </View>
      </View>
  );
};

ScrollComponent.propTypes = {
  user: PropTypes.object.isRequired,
  historyData: PropTypes.arrayOf(PropTypes.shape({
    upc: PropTypes.string,
    productName: PropTypes.string,
    dateTriedOn: PropTypes.string,
    datePurchased: PropTypes.string,
    purchased: PropTypes.bool,
  })).isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default ScrollComponent;
