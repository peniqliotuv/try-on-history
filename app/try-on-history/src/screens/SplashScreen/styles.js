import { StyleSheet } from 'react-native';
import colors from '../../globals/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.cobaltBlue,
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 45,
  },
  titleLight: {
    fontSize: 56,
    fontWeight: '100',
    color: colors.white,
  },
  title: {
    fontSize: 56,
    color: colors.white,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    top: 12.5,
    left: '-75%',
    height: 300,
  },
  buttonContainer: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.white,
    height: 40,
    margin: 20,
  },
  buttonText: {
    fontWeight: '100',
    color: colors.darkGrey,
  },
});
