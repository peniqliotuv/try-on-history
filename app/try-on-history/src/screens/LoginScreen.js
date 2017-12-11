import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';


const Container = styled.View`
  margin: 20px;
`

class LoginScreen extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
  };

  render() {

    if (!isEmpty(this.props.user)) {
      return (
        <View>
          <Text> Logged In! </Text>
        </View>
      );
    }

    return (
      <Container>
        <Text>Not Logged In!</Text>
      </Container>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    error: state.auth.error,
  }
}

export default connect(mapStateToProps)(LoginScreen);
