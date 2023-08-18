/**
 * Sample BLE React Native App
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  ImageBackground,
} from 'react-native';
import { clearAll } from './services/AsyncStorage';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const Landing = (props) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnectedPeri, setIsConnectedPeri] = useState({});
  const [isHeartBeat, setIsHeartBeat] = useState('0');
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  console.debug('peripherals map updated', [...peripherals.entries()]);

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
            console.log("dta", BleScanCallbackType.AllMatches)
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, { ...peripheral, connected: false });
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  const disconnectPeripheral = async (peripheral: Peripheral) => {

    try {
      setIsConnected(false);
      await BleManager.disconnect(peripheral.id);
      console.log(isConnected, "isConnected")
    } catch (error) {
      console.error(
        `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
        error,
      );
    }

  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, { ...peripheral, connected: true });
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };
  const connectPeripheral = async (peripheral: Peripheral) => {
    // try {
    if (peripheral) {
      addOrUpdatePeripheral(peripheral.id, { ...peripheral, connecting: true });
      console.log("peripheral.id", peripheral.id)
      await BleManager.connect(peripheral.id);
      console.debug(`[connectPeripheral][${peripheral.id}] connected.`);
      setIsConnected(true);
      setIsConnectedPeri(peripheral);
      addOrUpdatePeripheral(peripheral.id, {
        ...peripheral,
        connecting: false,
        connected: true,
      });

      // before retrieving services, it is often a good idea to let bonding & connection finish properly
      await sleep(900);

      /* Test read current RSSI value, retrieve services first */
      const peripheralData = await BleManager.retrieveServices(peripheral.id);
      console.debug(
        `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
        JSON.stringify(peripheralData),
      );

      const rssi = await BleManager.readRSSI(peripheral.id);
      console.debug(
        `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
      );

      if (peripheralData.characteristics) {
        for (let characteristic of peripheralData.characteristics) {
          if (characteristic.descriptors) {
            for (let descriptor of characteristic.descriptors) {
              try {
                let data = await BleManager.readDescriptor(
                  peripheral.id,
                  characteristic.service,
                  characteristic.characteristic,
                  descriptor.uuid,
                );
                console.debug(
                  `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                  data,
                );
              } catch (error) {
                console.error(
                  `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                  error,
                );
              }
            }
          }
        }
        console.log("length", peripheralData.characteristics.length, peripheralData.characteristics[16])
        BleManager.startNotification('F5:C5:60:11:0B:30', peripheralData.characteristics[16].service, peripheralData.characteristics[16].characteristic,)
          .then(() => {
            console.log('Notifications enabled');

            // Listen for notifications
            bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data) => {
              console.log('Notification received:', data);

              setIsHeartBeat(data.value[1]);
              // Handle the received data here
            });
          })
          .catch(error => {
            console.error('Error enabling notifications:', error);
          });
        // BleManager.read(
        //   'F5:C5:60:11:0B:30',
        //   peripheralData.characteristics[17].service,
        //   peripheralData.characteristics[17].characteristic,
        // )
        //   .then(res => {
        //     console.log('=======>Before read');
        //     console.log(res);
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
        // let data = await BleManager.write(
        //   'F5:C5:60:11:0B:30',
        //   peripheralData.characteristics[17].service,
        //   peripheralData.characteristics[17].characteristic,
        //   [1, 88, 27, 0]
        // )
        // console.log("write", data)
        // console.log("Writig completed", peripheralData.characteristics[17].service, peripheralData.characteristics[17].characteristic, peripheralData.characteristics[17].descriptors)
        // await new Promise(resolve => setTimeout(resolve, 5000));
        // BleManager.read(
        //   'F5:C5:60:11:0B:30',
        //   peripheralData.characteristics[17].service,
        //   peripheralData.characteristics[17].characteristic,
        // )
        //   .then(res => {
        //     console.log('=======>+After read');
        //     console.log(res);
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });

      }

      let p = peripherals.get(peripheral.id);
      if (p) {
        addOrUpdatePeripheral(peripheral.id, { ...peripheral, rssi });
      }
    }
    // } catch (error) {
    //   console.error(
    //     `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
    //     error,
    //   );
    // }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug('BleManager started.'))
        .catch(error =>
          console.error('BeManager could not be started.', error),
        );
        BleManager.enableBluetooth().then(() => {
          console.log('Bluetooth is turned on!');
        });
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function logoutClick() {
    clearAll();
    props.navigation.replace('Login');
  }
  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({ item }: { item: Peripheral }) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;
    return (
      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => connectPeripheral(item)}>
        <View style={[styles.row, { backgroundColor }]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
      <ImageBackground source={{ uri: 'https://st2.depositphotos.com/3071417/5418/v/450/depositphotos_54184433-stock-illustration-ringing-phone-icon.jpg' }} resizeMode="cover" style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={retrieveConnected}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable>

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}

        {isConnected ? (
          <TouchableHighlight
            underlayColor="#0082FC"
            onPress={() => disconnectPeripheral(isConnectedPeri)}>
            <View style={[styles.row, { backgroundColor: '#00cccc' }]}>
              <Text style={{  color: 'white', fontSize: 20, textAlign: 'center', padding: 2, }}>Connected.{'\n'}</Text>
              <Text style={styles.peripheralName}>
                {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
                {isConnectedPeri.name} - {isConnectedPeri?.advertising?.localName}
                {isConnectedPeri.connecting && ' - Connecting...'}
              </Text>
              <Text style={styles.rssi}>RSSI: {isConnectedPeri.rssi}</Text>
              <Text style={styles.peripheralId}>{isConnectedPeri.id}</Text>
              <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 2, }}>
                {'\n'}Heart Beat:{isHeartBeat} BPM{'\n'}</Text>
            </View>
          </TouchableHighlight>

        ) : (
          <FlatList
            data={Array.from(peripherals.values())}
            contentContainerStyle={{ rowGap: 12 }}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}

        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.scanButton, {
            alignItems: 'center', width: 150,
            marginTop: 150,
            justifyContent: 'center', textAlign: 'center', color: 'white'
          }]} onPress={logoutClick}>Logout</Text>
        </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default Landing;
