import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {storeDataJsonValue} from './services/AsyncStorage';
import Assets from '../config/Assets';

export default function Login(props) {
  function loginClick() {
    props.navigation.replace('Landing');
    storeDataJsonValue({status: 'sucess'});
  }
  function signupClick() {
    props.navigation.navigate('Signup');
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image style={{width: 100, height: 100,position:'relative'}} source={require('./bluetooth.png')} />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Sign In</Text>

        <View style={styles.feilds}>
          <Text style={styles.emailLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'grey'}
            returnKeyType="next"
            autoCapitalize={'none'}
            autoCorrect={false}
            blurOnSubmit={false}
          />
          <Text style={styles.passwordLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={'grey'}
            returnKeyType="next"
            autoCapitalize={'none'}
            autoCorrect={false}
            blurOnSubmit={false}
          />

          <TouchableOpacity style={styles.button} onPress={loginClick}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.forgotPassword}>Forgot password?</Text>

        <Text style={styles.otherOptions}>or Signin via</Text>
        <View style={styles.signinOptions}>
          <Image source={Assets.facebook} style={styles.facebook} />
          <Image source={Assets.google} style={styles.google} />
          <Image source={Assets.instagram} style={styles.instagram} />
        </View>
        <View style={styles.newUser}>
          <Text>Don't have an account?</Text>
          <Text style={styles.signup} onPress={signupClick}>
            {' '}
            Sign Up
          </Text>
        </View>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {backgroundColor: '#2196F3', flex: 1},
  logoContainer: {
    backgroundColor: 'blue',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
    top: 70,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    left: '50%',
    marginLeft: -50,
    overflow: 'hidden',
    // borderColor: 'gray',
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
    fontSize: 60,
  },
  feilds: {justifyContent: 'center', alignItems: 'center'},
  emailLabel: {
    position: 'absolute',
    top: -12,
    left: 80,
    backgroundColor: 'white',
    // paddingHorizontal: 5,
    fontSize: 16,
    color: 'gray',
    zIndex: 9999,
  },
  passwordLabel: {
    position: 'absolute',
    top: 50,
    left: 80,
    backgroundColor: 'white',
    // paddingHorizontal: 5,
    fontSize: 16,
    color: 'gray',
    zIndex: 9999,
  },
  textInput: {
    // backgroundColor: '#fff',
    width: windowWidth * 0.7,
    height: windowWidth * 0.1,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
    color: 'black',
  },
  loginContainer: {
    flex: 1,
    marginTop: 120,
    // marginLeft: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  loginText: {
    marginTop: 100,
    marginBottom: 30,
    fontSize: 25,
    textAlign: 'center',
  },
  forgotPassword: {
    width: windowWidth * 0.8,
    color: '#e8ca87',
    textAlign: 'right',
    marginTop: 10,
  },
  button: {
    height: windowWidth * 0.1,
    width: windowWidth * 0.7,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    // backgroundColor: Colors.negativeButton,
    // margin: 10,
    backgroundColor: '#0edfc6',
  },
  otherOptions: {
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  newUser: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: 25,

    alignItems: 'center',
    justifyContent: 'center',
  },
  signup: {color: '#e8ca87', marginLeft: 5},
  signinOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  facebook: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    marginRight: 10,
  },
  google: {
    width: windowWidth * 0.08,
    height: windowWidth * 0.08,
    marginRight: 10,
  },
  instagram: {
    width: windowWidth * 0.08,
    height: windowWidth * 0.08,
  },
});
