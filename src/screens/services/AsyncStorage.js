import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeDataJsonValue = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    console.log(jsonValue);

    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    console.log('error storeDataJsonValue' + value + e);
  }
  console.log('storeDataJsonValue' + value);
};
export const getDataJsonValue = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    console.log('AsynStorage jsonValue', jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error getDataJsonValue', e);
  }
};
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log('error clearAll', e);
  }

  console.log('clearAll.');
};
