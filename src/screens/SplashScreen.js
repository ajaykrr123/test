import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {getDataJsonValue} from './services/AsyncStorage';

export default function SplashScreen(props) {
  const getUserData = async () => {
    let value = await getDataJsonValue();
    if (value) {
      props.navigation.replace('Landing');
    } else {
      props.navigation.replace('Login');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer1}></View>
      <View style={styles.logoContainer2}></View>
      <View style={styles.logoContainer3}>
        <Text style={styles.logoText}>D</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5190f3',
  },
  logoContainer1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3eaee6',
  },
  logoContainer2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#3caae1',
  },
  logoContainer3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logoText: {
    fontSize: 70,
    textAlign: 'center',
  },
});
