import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {clearAll} from './services/AsyncStorage';

export default function Landing(props) {
  function logoutClick() {
    clearAll();
    props.navigation.replace('Login');
  }
  return (
    <View>
      <View style={styles.header}>
        {/* <Text>Landing</Text> */}
        <Text onPress={logoutClick}>LogoutVishnu</Text>
      </View>
    </View>
  );
}

// const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  header: {backgroundColor: 'white', flexDirection: 'row'},
});
