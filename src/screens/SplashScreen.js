import {StyleSheet, Text, View,Image} from 'react-native';
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
    setTimeout(()=>{getUserData()}, 2000);
    
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer1}></View>
      <View style={styles.logoContainer2}></View>
      <View style={styles.logoContainer3}>
        <Image style={{width: 100, height: 100,position:'relative'}} source={require('./bluetooth.png')} />
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
    overflow: 'hidden',
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
