import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

export default function Signup(props) {
  function signupClick() {
    props.navigation.navigate('Login');
  }
  function signinClick() {
    props.navigation.navigate('Login');
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>D</Text>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Sign Up</Text>

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
          <Text style={styles.mobileLabel}>Mobile number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your mobile number"
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
          <Text style={styles.confirmLabel}>Confirm password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm password"
            placeholderTextColor={'grey'}
            returnKeyType="next"
            autoCapitalize={'none'}
            autoCorrect={false}
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.button} onPress={signupClick}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.existingUser}>
          <Text>Already have an account?</Text>
          <Text style={styles.signin} onPress={signinClick}>
            Sign In
          </Text>
        </View>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {backgroundColor: '#3d72de', flex: 1},
  logoContainer: {
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
  mobileLabel: {
    position: 'absolute',
    top: 50,
    left: 80,
    backgroundColor: 'white',
    // paddingHorizontal: 5,
    fontSize: 16,
    color: 'gray',
    zIndex: 9999,
  },
  passwordLabel: {
    position: 'absolute',
    top: 110,
    left: 80,
    backgroundColor: 'white',
    // paddingHorizontal: 5,
    fontSize: 16,
    color: 'gray',
    zIndex: 9999,
  },
  confirmLabel: {
    position: 'absolute',
    top: 170,
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
  signupContainer: {
    flex: 1,
    marginTop: 120,
    // marginLeft: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  signupText: {
    marginTop: 100,
    marginBottom: 30,
    fontSize: 25,
    textAlign: 'center',
  },
  button: {
    height: windowWidth * 0.1,
    width: windowWidth * 0.7,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#0edfc6',
  },
  existingUser: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signin: {color: '#e8ca87', marginLeft: 5},
});
