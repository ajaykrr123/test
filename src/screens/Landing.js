import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Button, TouchableOpacity} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export default function Landing() {
  const [devices, setDevices] = useState([]);
  const manager = new BleManager();
  useEffect(async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result !== RESULTS.GRANTED) {
      // Handle permission not granted
    }

    const subscription = manager.onStateChange(state => {
      console.log('state', state);
      if (state === 'PoweredOn') {
        startScan();
        subscription.remove();
      }
    }, true);

    return () => subscription.remove();
  }, []);
  function startScan() {
    setTimeout(() => {
      console.log('timeOut');
      manager.stopDeviceScan();
    }, 500);
    manager.startDeviceScan(null, {ScanMode: -1}, (error, scannedDevice) => {
      if (error) {
        console.log('error', error);
        // Handle error (scanning will be stopped automatically)
        return;
      }

      setDevices(prevDevices => {
        const existingDevice = prevDevices.find(
          device => device.id === scannedDevice.id,
        );
        if (existingDevice) {
          return prevDevices.map(device =>
            device.id === scannedDevice.id ? scannedDevice : device,
          );
        } else {
          return [...prevDevices, scannedDevice];
        }
      });
    });
  }
  const renderDeviceItem = ({item}) => (
    <View style={{padding: 10}}>
      <Text>{item.name}</Text>
      <Text>{item.id}</Text>
    </View>
  );

  return (
    <View>
      <TouchableOpacity
        style={{
          width: 200,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          backgroundColor: '#f00',
        }}
        onPress={() => {
          console.log('Start Bluetooth Scan');
          startScan();
          setDevices([]);
        }}>
        <Text style={{}}>Start Bluetooth Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 200,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          backgroundColor: '#fe0',
        }}
        onPress={() => {
          console.log('device', devices);
        }}>
        <Text style={{}}>Test</Text>
      </TouchableOpacity>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};