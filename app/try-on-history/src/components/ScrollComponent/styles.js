import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  userContainer: {
    backgroundColor: colors.cobaltBlue,
    flex: 2,
    alignSelf: 'stretch',
  },
  historyContainer: {
    backgroundColor: colors.white,
    flex: 5,
    alignSelf: 'stretch',
  },
  flatList: {
    flex: 1,
  },
});
