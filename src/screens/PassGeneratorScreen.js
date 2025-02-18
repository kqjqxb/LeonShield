import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Keychain from 'react-native-keychain';
import Clipboard from '@react-native-clipboard/clipboard';
import { set } from 'date-fns';



const fontMontserratBold = 'Montserrat-Bold';
const fontIceLandRegular = 'Iceland-Regular';

const PassGeneratorScreen = ({ isHidePasswordEnabled, generatedPassword, setGeneratedPassword, isVibrationEnabled }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        setDots('');
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots.length < 10 ? prevDots + '*' : ''));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const generateRandomPassword = (length) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    };

    const generatePassword = async () => {

        try {
            const password = generateRandomPassword(12); // Generate a 12-character password
            setGeneratedPassword(password);
            Alert.alert('Generated Password', password);

            // Optionally, store the password in the keychain
            await Keychain.setGenericPassword('user', password);
        } catch (error) {
            console.error('Error generating password', error);
            Alert.alert('Error', 'Failed to generate password');
        }
    };


    const copyToClipboard = () => {
        if (isVibrationEnabled) {
            ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
            });
        }
        Clipboard.setString(generatedPassword);
        Alert.alert('Copied to Clipboard', 'The generated password has been copied to your clipboard.');
    };

    return (
        <SafeAreaView style={{ marginBottom: 100, width: '100%', }}>
            <Image
                source={require('../assets/images/leonIconImage.png')}
                style={{
                    width: dimensions.width * 0.5,
                    height: dimensions.width * 0.5,
                    marginTop: dimensions.height * 0.05,
                    alignSelf: 'center',
                }}
                resizeMode='contain'
            />
            <Text
                style={{
                    fontFamily: fontIceLandRegular,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.055,
                    fontWeight: 400,
                    color: 'white',
                    textTransform: 'uppercase',
                }}
            >
                PASSWORD GENERATOR:
            </Text>

            <View style={{
                width: dimensions.width * 0.7,
                backgroundColor: '#1E1E1E',
                padding: dimensions.width * 0.05,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: dimensions.width * 0.03,
                borderColor: 'white',
                borderWidth: dimensions.width * 0.0025,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.019,
            }}>
                <Text
                    style={{
                        fontFamily: fontMontserratBold,
                        textAlign: "center",
                        fontSize: dimensions.width * 0.04,
                        fontWeight: 500,
                        color: 'white',
                    }}
                >
                    {!isGeneratingPassword && isHidePasswordEnabled ? '****_****_****' : !isGeneratingPassword && !isHidePasswordEnabled ? generatedPassword : dots}
                </Text>
                <TouchableOpacity onPress={() => {
                    if (generatedPassword === '****_****_****') {
                        Alert.alert('Error', 'Please generate a password first');
                        return;
                    } else copyToClipboard();

                }}>
                    <Image
                        source={require('../assets/icons/copyIcon.png')}
                        style={{
                            width: dimensions.width * 0.05,
                            height: dimensions.width * 0.05,
                            alignSelf: 'center',
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>



            <TouchableOpacity
                onPress={() => {
                    setIsGeneratingPassword(true);
                    setTimeout(() => {
                        setIsGeneratingPassword(false);
                        generatePassword();
                    }, 2500);
                }}
                style={{
                    backgroundColor: '#FF1A1A',
                    padding: dimensions.width * 0.05,
                    borderRadius: dimensions.width * 0.03,
                    marginTop: dimensions.width * 0.05,
                    alignSelf: 'center',
                    width: dimensions.width * 0.55,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Image
                    source={require('../assets/icons/generateIcon.png')}
                    style={{
                        width: dimensions.width * 0.05,
                        height: dimensions.width * 0.05,
                        alignSelf: 'center',
                    }}
                    resizeMode='contain'
                />
                <Text style={{
                    color: 'white',
                    fontSize: dimensions.width * 0.04,
                    fontFamily: fontMontserratBold,
                    fontWeight: 700,
                    textAlign: 'center',
                    paddingHorizontal: dimensions.width * 0.019,
                }}>
                    Generate new
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PassGeneratorScreen;