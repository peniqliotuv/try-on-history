import styled from 'styled-components/native';
import { Text } from 'react-native';
import colors from './colors';


export const TextField = styled.Text`
  color: ${colors.white};
  font-size: ${props => props.fontSize || '16px'};
`;
