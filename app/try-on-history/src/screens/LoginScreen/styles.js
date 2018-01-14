import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 70,
    paddingBottom: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'stretch',
    fontSize: 20,
    color: colors.darkGrey,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: colors.cobaltBlue,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
  },
  paddinglessButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddinglessButtonText: {
    color: colors.darkGrey,
  },
});
