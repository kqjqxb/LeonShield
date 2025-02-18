import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';


const Stack = createNativeStackNavigator();

const LeonShieldStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isLeonOnboardWasVisible, setIsLeonOnboardWasVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingLeonShieldApp, setInitializingLeonShieldApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadLeonShieldUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedLeonShieldUser = await AsyncStorage.getItem(storageKey);
        const isLeonShieldOnboardingVisible = await AsyncStorage.getItem('isLeonShieldOnboardingVisible');

        if (storedLeonShieldUser) {
          setUser(JSON.parse(storedLeonShieldUser));
          setIsLeonOnboardWasVisible(false);
        } else if (isLeonShieldOnboardingVisible) {
          setIsLeonOnboardWasVisible(false);
        } else {
          setIsLeonOnboardWasVisible(true);
          await AsyncStorage.setItem('isLeonShieldOnboardingVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of cur user', error);
      } finally {
        setInitializingLeonShieldApp(false);
      }
    };
    loadLeonShieldUser();
  }, [setUser]);

  if (initializingLeonShieldApp) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#000000',
      }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={isLeonOnboardWasVisible ? 'OnboardingScreen' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default LeonShieldStack;
