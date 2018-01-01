import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 45,
  },
  titleLight: {
    fontSize: 48,
    fontWeight: '100',
    color: colors.darkGrey,
  },
  title: {
    fontSize: 48,
    fontWeight: '400',
    color: colors.darkGrey,
  },
  inputField: {
    margin: 20,
    height: 40,
    fontSize: 20,
  },
});
