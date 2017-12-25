import styled from 'styled-components/native';
import colors from './colors';


export const Text = styled.Text`
  color: ${colors.white};
  font-size: ${props => props.fontSize || '16px'};
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.cobaltBlue};
`;
