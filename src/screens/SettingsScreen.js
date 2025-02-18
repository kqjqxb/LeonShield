import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView, Share, Alert, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBold = 'Montserrat-Bold';
const fontIceLandRegular = 'Iceland-Regular';

const appLink = 'https://apps.apple.com/us/app/leonshield-security-assistant/id6742137859';

const SettingsScreen = ({ isNotificationEnabled, setNotificationEnabled, isHidePasswordEnabled, setHidePasswordEnabled, isVibrationEnabled, setVibrationEnabled }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const toggleHidePasswordSwitch = () => {
        const newValue = !isHidePasswordEnabled;
        setHidePasswordEnabled(newValue);
        saveSettings('isHidePasswordEnabled', newValue);
    };

    const toggleVibrationSwitch = () => {
        const newValue = !isVibrationEnabled;
        setVibrationEnabled(newValue);
        saveSettings('isVibrationEnabled', newValue);
    };

    const toggleNotificationSwitch = () => {
        const newValue = !isNotificationEnabled;
        setNotificationEnabled(newValue);
        saveSettings('isNotificationEnabled', newValue);
    };

    const shareApp = async () => {
        try {
            await Share.share({
                message: `Join Leon Shield - Security Assistent! \n${appLink}`,
            });
        } catch (error) {
            console.error('Error tip:', error);
        }
    };


    const saveSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };


    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            RNRestart.Restart();
            console.log('AsyncStorage очищено');
        } catch (error) {
            console.error('Помилка при очищенні AsyncStorage', error);
        }
    };


    const toggleDeleteAppData = () => {
        Alert.alert(
            'Deleting all app data',
            'Are you sure you want to delete all app data?',
            [
                { 
                    text: 'Delete', 
                    onPress: clearAsyncStorage,
                    style: 'default',
                    textStyle: { fontWeight: 'normal' } 
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                    textStyle: { fontWeight: 'bold' } 
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView style={{ marginBottom: 100, width: '100%', }}>
            <Text
                style={{
                    fontFamily: fontIceLandRegular,
                    textAlign: "left",
                    fontSize: dimensions.width * 0.07,
                    fontWeight: 400,
                    color: 'white',
                    marginLeft: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.025,
                }}
            >
                SETTINGS:
            </Text>


            <View style={{
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                marginTop: dimensions.width * 0.025,
                borderRadius: dimensions.width * 0.05,
                paddingVertical: dimensions.width * 0.01,
                paddingHorizontal: dimensions.width * 0.03,
                backgroundColor: 'white',
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomColor: '#c5c5c6',
                    borderBottomWidth: 0.4,
                    borderRadius: 8,
                }}>
                    <Text style={{
                        color: '#000000',
                        fontSize: dimensions.width * 0.044,
                        fontFamily: fontMontserratRegular,
                    }}>Vibration</Text>
                    <Switch
                        trackColor={{ false: '#948ea0', true: '#34C759' }}
                        thumbColor={isVibrationEnabled ? '#FFFFFF' : '#FFFFFF'}
                        ios_backgroundColor="#3E3E3E"
                        onValueChange={toggleVibrationSwitch}
                        value={isVibrationEnabled}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomColor: '#c5c5c6',
                    borderBottomWidth: 0.4,
                    borderRadius: 8,
                }}>
                    <Text style={{
                        color: '#000000',
                        fontSize: dimensions.width * 0.044,
                        fontFamily: fontMontserratRegular,
                    }}>Notifications</Text>
                    <Switch
                        trackColor={{ false: '#948ea0', true: '#34C759' }}
                        thumbColor={isNotificationEnabled ? '#FFFFFF' : '#FFFFFF'}
                        ios_backgroundColor="#3E3E3E"
                        onValueChange={toggleNotificationSwitch}
                        value={isNotificationEnabled}
                    />
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomColor: '#c5c5c6',
                }}>
                    <Text style={{
                        color: '#000000',
                        fontSize: dimensions.width * 0.044,
                        fontFamily: fontMontserratRegular,
                        fontWeight: 400
                    }}>Hide passwords by default</Text>
                    <Switch
                        trackColor={{ false: '#948ea0', true: '#34C759' }}
                        thumbColor={isHidePasswordEnabled ? '#FFFFFF' : '#FFFFFF'}
                        ios_backgroundColor="#3E3E3E"
                        onValueChange={toggleHidePasswordSwitch}
                        value={isHidePasswordEnabled}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={toggleDeleteAppData} style={{
                backgroundColor: '#FF1A1A',
                padding: dimensions.width * 0.05,
                borderRadius: dimensions.width * 0.03,
                marginTop: dimensions.width * 0.05,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: dimensions.width * 0.04,
                    fontFamily: fontMontserratBold,
                    fontWeight: 700,
                    textAlign: 'center',
                }}>
                    Delete all app data
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareApp} style={{
                backgroundColor: '#1E1E1E',
                padding: dimensions.width * 0.05,
                borderRadius: dimensions.width * 0.03,
                marginTop: dimensions.width * 0.019,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: dimensions.width * 0.04,
                    fontFamily: fontMontserratBold,
                    fontWeight: 700,
                    textAlign: 'center',
                }}>
                    Share app
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default SettingsScreen;