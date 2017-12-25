import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import AppNavigator from '../../AppNavigator';

let initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

const firstAction = AppNavigator.router.getActionForPathAndParams('Login');

initialState = AppNavigator.router.getStateForAction(
  firstAction,
  initialState
);

export default (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};
