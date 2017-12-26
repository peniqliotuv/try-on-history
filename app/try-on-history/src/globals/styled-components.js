import styled from 'styled-components/native';
import colors from './colors';

// Helper functions to add margin and padding props
const createMarginFromProps = (props, defaultMargin = '0') => {
  return (`
    margin-left: ${props.marginLeft || defaultMargin};
    margin-right: ${props.marginRight || defaultMargin};
    margin-top: ${props.marginTop || defaultMargin};
    margin-bottom: ${props.marginBottom || defaultMargin};
  `);
};

const createPaddingFromProps = (props, defaultPadding = '0') => {
  return (`
    padding-left: ${props.paddingLeft || defaultPadding};
    padding-right: ${props.paddingRight || defaultPadding};
    padding-top: ${props.paddingTop || defaultPadding};
    padding-bottom: ${props.paddingBottom || defaultPadding};
  `);
};

export const StyledText = styled.Text`
  color: ${(props) => colors[props.color] || colors.darkGrey};
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  font-style: ${(props) => props.fontStyle || 'normal'};
  text-align: ${(props) => props.textAlign || 'auto'};
`;

export const Container = styled.View`
  ${(props) => createMarginFromProps(props)}
  ${(props) => createPaddingFromProps(props)}
  flex: 1;
  background-color: ${(props) => colors[props.backgroundColor] || colors.cobaltBlue};
`;

export const StyledImage = styled.Image`
  ${(props) => createMarginFromProps(props)}
  ${(props) => createPaddingFromProps(props)}
  position: ${(props) => props.position || 'relative'};
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};
`;

export const StyledButton = styled.TouchableHighlight`
  border-radius: ${(props) => props.borderRadius || '5px'};
  border-color: ${(props) => colors[props.borderColor] || props.borderColor || 'transparent'};
  height: ${(props) => props.height || '40px'};
  width: ${(props) => props.width || '120px'};
  align-items: center;
  justify-content: center;
  ${(props) => createMarginFromProps(props)}
  ${(props) => createPaddingFromProps(props)}
  background-color: ${(props) => colors[props.backgroundColor] || props.backgroundColor || colors.white}
`;
