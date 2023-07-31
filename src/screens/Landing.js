import {View, Text, StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import {clearAll} from './services/AsyncStorage';
import { BleManager } from 'react-native-ble-plx';

export default function Landing(props) {
  

  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const bleManager = new BleManager();

  useEffect(() => {
    return () => {
      // Cleanup the Bluetooth manager when the component unmounts
      bleManager.destroy();
    };
  }, []);

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
          title: 'Location permission for bluetooth scanning',
          message: 'wahtever',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ); 
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission for bluetooth scanning granted');
        return true;
      } else {
        console.log('Location permission for bluetooth scanning revoked');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  const scanForDevices = async () => {
    const permission = requestLocationPermission(); 
    try {
      setScanning(true);
      setDevices([]); // Clear the previous scan results
      await bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Error scanning:', error);
          return;
        }

        console.log('Scanned device:', device.id, device.name);

        // Check if the device is not already in the list
        if (!devices.some((dev) => dev.id === device.id)) {
          setDevices((prevDevices) => [...prevDevices, device]);
        }
      });
    } catch (error) {
      console.error('Error while scanning:', error);
    }
  };
  return (
    <View>
      <View style={styles.header}>
        {/* <Text>Landing</Text> */}
        <Text onPress={() => scanForDevices()}>LogoutVishnu</Text>
      </View>
    </View>
  );

}

// const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  header: {backgroundColor: 'white', flexDirection: 'row'},
});
