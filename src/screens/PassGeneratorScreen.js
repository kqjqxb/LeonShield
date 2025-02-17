import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { styled } from 'nativewind';
import { ScrollView } from 'react-native-gesture-handler';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratSemiBold = 'Montserrat-SemiBold';
const fontMontserratBold = 'Montserrat-Bold';
const fontIceLandRegular = 'Iceland-Regular';

const PassGeneratorScreen = ({ }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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
                    ****_****_****
                </Text>
                <TouchableOpacity>
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