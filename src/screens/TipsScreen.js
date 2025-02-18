import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScrollView } from 'react-native-gesture-handler';

const fontMontserratRegular = 'Montserrat-Regular';
const fontIceLandRegular = 'Iceland-Regular';

const TipsScreen = ({ favoritesTips, setFavoritesTips, securityTips }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const shareSecurityTip = async (favTipTitle) => {
        try {
            if (!favTipTitle) {
                Alert.alert('Error', 'No security tip here');
                return;
            }
            await Share.share({
                message: `My saved security tip is '${favTipTitle}'`,
            });
        } catch (error) {
            console.error('Error securityTip:', error);
        }
    };

    const saveTip = async (tipToSave) => {
        try {
          const savedTip = await AsyncStorage.getItem('favoritesTips');
          const parsedTip = savedTip ? JSON.parse(savedTip) : [];
    
          const tipIndex = parsedTip.findIndex((fav) => fav.id === tipToSave.id);
    
          if (tipIndex === -1) {
            const updatedTips = [tipToSave, ...parsedTip];
            await AsyncStorage.setItem('favoritesTips', JSON.stringify(updatedTips));
            setFavoritesTips(updatedTips);
            console.log('tipToSave збережена');
          } else {
            const updatedTips = parsedTip.filter((fav) => fav.id !== tipToSave.id);
            await AsyncStorage.setItem('favoritesTips', JSON.stringify(updatedTips));
            setFavoritesTips(updatedTips);
            console.log('tipToSave видалена');
          }
        } catch (error) {
          console.error('Помилка збереження/видалення tipp:', error);
        }
      };

    const isTipFavorite = (selectedFavTip) => {
        return favoritesTips.some((fav) => fav.id === selectedFavTip.id);
    };





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
                ONLINE SECURITY TIPS:
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width: '100%', height: '100%', }}
            >
                <View style={{
                    flex: 1,

                    borderRadius: dimensions.width * 0.05,
                    position: 'relative',
                    marginBottom: dimensions.height * 0.3,

                    width: '95%',
                    alignSelf: 'center',
                }}>
                    {securityTips.map((securityTip, index) => (
                        <View
                            key={securityTip.id}
                            style={{
                                backgroundColor: '#1E1E1E',
                                width: dimensions.width * 0.9,
                                borderRadius: dimensions.width * 0.037,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                paddingTop: dimensions.height * 0.025,
                                paddingBottom: dimensions.height * 0.01,
                                paddingHorizontal: dimensions.width * 0.04,
                                borderColor: 'white',
                                borderWidth: dimensions.width * 0.0025,

                                marginTop: dimensions.height * 0.019,
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                            }}>
                                <Image
                                    source={require('../assets/icons/securityIcon.png')}
                                    style={{
                                        width: dimensions.height * 0.03,
                                        height: dimensions.height * 0.03,

                                    }}
                                    resizeMode='contain'
                                />

                                <Text
                                    style={{
                                        fontFamily: fontMontserratRegular,
                                        fontSize: dimensions.width * 0.043,
                                        color: 'white',
                                        paddingHorizontal: dimensions.width * 0.025,
                                        fontWeight: 500,
                                        textAlign: 'left',
                                        maxWidth: dimensions.width * 0.7,
                                    }}
                                >
                                    {securityTip.tipTitle}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontFamily: fontMontserratRegular,
                                    fontSize: dimensions.width * 0.04,
                                    color: '#A4A4A4',
                                    paddingTop: dimensions.width * 0.03,
                                    fontWeight: 300,
                                    textAlign: 'left',
                                }}
                            >
                                {securityTip.tipText}
                            </Text>


                            <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                paddingBottom: dimensions.width * 0.03,
                                width: dimensions.width * 0.8,
                                marginTop: dimensions.height * 0.02,
                            }}>

                                <TouchableOpacity
                                    onPress={() => saveTip(securityTip)}
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: isTipFavorite(securityTip) ? '#FF1A1A' : '#0F0F0F',
                                        paddingVertical: dimensions.height * 0.016,
                                        justifyContent: 'center',
                                        borderRadius: dimensions.width * 0.04,
                                        width: dimensions.width * 0.37,
                                        flexDirection: 'row',
                                    }}
                                >

                                    <Image
                                        source={require('../assets/icons/saveIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.04,
                                            height: dimensions.width * 0.04,
                                            top: '0%',
                                            textAlign: 'center'
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: dimensions.width * 0.04,
                                            fontWeight: 'bold',
                                            paddingHorizontal: dimensions.width * 0.016,
                                            color: 'white',
                                        }}
                                    >
                                        {!isTipFavorite(securityTip) ? 'Save' : 'Saved'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: '#3991F5',
                                        paddingVertical: dimensions.height * 0.016,
                                        justifyContent: 'center',
                                        borderRadius: dimensions.width * 0.04,
                                        backgroundColor: '#0F0F0F',
                                        flexDirection: 'row',
                                        width: dimensions.width * 0.37,
                                    }}
                                    onPress={() => shareSecurityTip(securityTip.tipTitle)}
                                >
                                    <Image
                                        source={require('../assets/icons/shareIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.04,
                                            height: dimensions.width * 0.04,
                                            top: '0%',
                                            textAlign: 'center'
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: dimensions.width * 0.04,
                                            paddingHorizontal: dimensions.width * 0.016,
                                            fontWeight: 'bold',
                                            color: 'white',
                                        }}
                                    >
                                        Share
                                    </Text>
                                </TouchableOpacity>


                            </View>

                        </View>
                    ))}


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: (dimensions) => ({
        color: 'white',
        fontFamily: 'MochiyPopOne-Regular',
        fontSize: dimensions.width * 0.07,
        marginBottom: 20,
        textAlign: 'center',
    }),
    generalText: (dimensions) => ({
        fontFamily: 'InknutAntiqua-Regular',
        fontSize: dimensions.width * 0.08,
        color: '#FAEDE1',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }),
});

export default TipsScreen;