import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBold = 'Montserrat-Bold';
const fontIceLandRegular = 'Iceland-Regular';

const SavedTipsScreen = ({ favoritesTips, setFavoritesTips }) => {
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
            console.error('Error favTip:', error);
        }
    };

    const handleDeleteSecurityTip = async (tipID) => {
        try {
            const updatedTips = favoritesTips.filter(tip => tip.id !== tipID);
            setFavoritesTips(updatedTips);
            await AsyncStorage.setItem('favoritesTips', JSON.stringify(updatedTips));
        } catch (error) {
            console.error("Error deleting security tip:", error);
        }
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
                SAVED TIPS:
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

                    {favoritesTips.length === 0 ? (
                        <View style={{
                            width: '95%',
                            backgroundColor: '#1E1E1E',
                            alignSelf: 'center',
                            position: 'relative',
                            borderRadius: dimensions.width * 0.04,
                            marginTop: dimensions.height * 0.016,
                            borderWidth: dimensions.width * 0.0025,
                            borderColor: 'white',
                        }}>
                            <View style={{
                                width: '100%',
                                alignSelf: 'center',
                                paddingVertical: dimensions.width * 0.04,
                                paddingHorizontal: dimensions.width * 0.04,
                            }}>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.05,
                                        paddingHorizontal: dimensions.width * 0.07,
                                        fontWeight: 500,
                                        fontFamily: fontMontserratBold,
                                        color: 'white',
                                        paddingVertical: dimensions.height * 0.025,
                                    }}
                                >
                                    Save some security tips to see them here!
                                </Text>
                            </View>
                        </View>
                    ) : (
                        favoritesTips.map((favTip, index) => (
                            <View
                                key={favTip.id}
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
                                        {favTip.tipTitle}
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
                                    {favTip.tipText}
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
                                        onPress={() => handleDeleteSecurityTip(favTip.id)}
                                        style={{
                                            alignItems: 'center',
                                            backgroundColor: '#FF1A1A',
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
                                            Saved
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
                                        onPress={() => shareSecurityTip(favTip.tipTitle)}
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
                        ))
                    )}

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

export default SavedTipsScreen;