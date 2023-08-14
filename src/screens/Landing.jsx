/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  ImageBackground
} from 'react-native';
import { styles } from '../styles/styles';
import { DeviceList } from '../DeviceList';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { clearAll } from './services/AsyncStorage';
import RNBluetoothClassic, {
  BluetoothDevice
} from 'react-native-bluetooth-classic';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Landing = (props) => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [bondedDevices, setbondedDevices] = useState([])
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const handleLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    }
  };
  function logoutClick() {
    clearAll();
    props.navigation.replace('Login');
  }

  const handleGetConnectedDevices = () => {
    BleManager.isPeripheralConnected().then(results => {
      console.log("results", results)
      // for (let i = 0; i < results.length; i++) {
      //   let peripheral = results[i];
      //   // peripheral.connected = true;
      //   peripherals.set(peripheral.id, peripheral);
      //   setbondedDevices(Array.from(peripherals.values()));
      // }
      // console.log("bondedDevices",bondedDevices);
    });
  };

  useEffect(() => {
    setConnectedDevices([]);
    handleLocationPermission();
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        console.log("peripheral", peripheral)
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log("DiscoveredDevices", discoveredDevices)
      },
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);

  const scan = async () => {
    if (!isScanning) {
      try {
        setIsScanning(true);
        console.log("Started Scanning....");
        const peripheral = await RNBluetoothClassic.startDiscovery();
        console.log("Stopped Scanning....");
        peripheral.forEach(element => {
          peripherals.set(element.id, element);     
        });
        let devices = Array.from(peripherals.values());
        console.log("Array.from(peripherals.values())",Array.from(peripherals.values()))
        setDiscoveredDevices(Array.from(devices)); 
        console.log("peripheral", JSON.stringify(peripheral));
        
        setIsScanning(false);

      } finally {
        console.log("DiscoveredDevices", discoveredDevices);
        Alert.alert("Scan completed");
        // this.setState({ devices, discovering: false });
      }

    } else {
      console.log("Already scanning");
      Alert.alert("Already scanning");
    }
  };

  const connect = async (peripheral) => {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("connecting peripheral",peripheral);
    console.log("peripheral.id",peripheral.id);
    // await BleManager.removeBond(peripheral.id);
    // try{
    //   await BleManager.removeBond(peripheral.id);
    // }catch(e){
    //   console.log(e)
    // }
   
    let data=await BleManager.createBond(peripheral.id);
      console.log("connectdata",data)
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        setConnectedDevices(Array.from(devices));
        setDiscoveredDevices(Array.from(devices));
        console.log('BLE device paired successfully');
        Alert.alert(`Connected successfully.`);
     
      
        console.log("Started for readwrite operation.")
        // readwrite(peripheral);
      
  };

  const readwrite = async (peripheral) => {
    console.log("Enteredx", JSON.stringify(peripheral));
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("Timout ended")
      let message="Hi first test";
      console.log("peripheral.id",peripheral.id)
      BleManager.retrieveServices('60:C7:BE:02:53:26').then((data) => {
        Alert.alert(`Retreived data ${data}`);
       console.log("Retreived data")
      })
      .catch((e) => {
        Alert.alert(`failed to retreive ${e}`);
        throw Error('failed to retreive');
      })     
      // await  RNBluetoothClassic.writeToDevice(peripheral.id,message);
      //     console.log("Write to device")
      //  let data=   await RNBluetoothClassic.readFromDevice(peripheral.id);
      //  console.log("data",data)
  };

  const disconnect = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        let devices = Array.from(peripherals.values());
        setConnectedDevices([]);
        setDiscoveredDevices(Array.from(devices));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        throw Error('fail to remove the bond');
      });
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ImageBackground source={{ uri: 'https://st2.depositphotos.com/3071417/5418/v/450/depositphotos_54184433-stock-illustration-ringing-phone-icon.jpg' }} resizeMode="cover" style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <View style={{ pdadingHorizontal: 20, flex: 1 }}>
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? Colors.white : Colors.black },
            ]}>
            Device Manager
          </Text>
          <TouchableOpacity
            onPress={scan}
            activeOpacity={0.5}
            style={styles.scanButton}>
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? Colors.white : Colors.black },
            ]}>
            Discovered Devices:
          </Text>
          {discoveredDevices.length > 0 ? (
            <FlatList
              data={discoveredDevices}
              renderItem={({ item }) => (
                <DeviceList
                  peripheral={item}
                  connect={connect}
                  disconnect={disconnect}
                />
              )}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
          )}

          <Text
            style={[
              styles.subtitle,
              { color: isDarkMode ? Colors.white : Colors.black },
            ]}>
            Connected Devices:
          </Text>
          {connectedDevices.length > 0 ? (
            <FlatList
              data={connectedDevices}
              renderItem={({ item }) => (
                <DeviceList
                  peripheral={item}
                  connect={connect}
                  disconnect={disconnect}
                />
              )}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text style={styles.noDevicesText}>No connected devices</Text>
          )}
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.scanButton, {
            alignItems: 'center', width: 150,
            marginTop: 150,
            justifyContent: 'center', textAlign: 'center', color: 'white'
          }]} onPress={logoutClick}>Logout</Text>
        </View>

      </ImageBackground>
    </SafeAreaView >
  );
};

export default Landing;
