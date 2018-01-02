import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 70,
    paddingBottom: 70,
  },
  titleContainer: {
    flex: 1,
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    height: 40,
    fontSize: 20,
  },
  textInputContainer: {
    backgroundColor: 'orange',
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'red',
    alignSelf: 'stretch',
    flex: 1,
    height: 100,
  },
  button: {
    height: 40,
    margin: 20,
    color: colors.white,
    backgroundColor: colors.cobaltBlue,
    borderRadius: 5,
  },
  paddinglessButton: {

  },
});
