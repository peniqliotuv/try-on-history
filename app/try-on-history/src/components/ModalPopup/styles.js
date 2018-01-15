import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: colors.lightGrey,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 90,
    marginBottom: 90,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
  },
  productName: {
    color: colors.white,
    fontSize: 16,
  },
  date: {
    color: colors.lightGrey,
  },
});
