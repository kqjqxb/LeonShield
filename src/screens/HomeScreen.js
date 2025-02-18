import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';



import SettingsScreen from './SettingsScreen';

import SavedTipsScreen from './SavedTipsScreen';
import TipsScreen from './TipsScreen';
import PassGeneratorScreen from './PassGeneratorScreen';
import NewReminderScreen from './NewReminderScreen';




const homePagesbottomIconsScr = [
  { screenTitle: 'NewReminder', screenIcon: require('../assets/icons/bottomIconsScr/remindersIcon.png'), },
  { screenTitle: 'Password Generator', screenIcon: require('../assets/icons/bottomIconsScr/generatorIcon.png'), },
  { screenTitle: 'Home', screenIcon: require('../assets/icons/bottomIconsScr/homeIcon.png'), },
  { screenTitle: 'Tips', screenIcon: require('../assets/icons/bottomIconsScr/tipsIcon.png'), },
  { screenTitle: 'Saved', screenIcon: require('../assets/icons/bottomIconsScr/savedIcon.png'), },
];



const securityTips = [
  {
    id: 1,
    tipTitle: 'Use Strong, Unique Passwords',
    tipText: 'Avoid using the same password across multiple sites. Create complex passwords with a mix of letters, numbers, and symbols.',
  },
  {
    id: 2,
    tipTitle: 'Enable Two-Factor Authentication (2FA)',
    tipText: "2FA adds an extra layer of security by requiring a second form of verification, such as a code sent to your phone.",
  },
  {
    id: 3,
    tipTitle: 'Keep Your Software Updated',
    tipText: "Regular updates patch vulnerabilities and help protect your devices from hackers.",
  },
  {
    id: 4,
    tipTitle: 'Beware of Public Wi-Fi',
    tipText: "Public networks can be easily hacked. Always use a VPN when connecting to public Wi-Fi.",
  },
  {
    id: 5,
    tipTitle: 'Use a Password Manager',
    tipText: "Password managers store and generate secure passwords, so you don’t have to remember them all.",
  },
  {
    id: 6,
    tipTitle: 'Avoid Phishing Scams',
    tipText: "Be cautious of suspicious emails or links. Always verify the source before clicking.",
  },
  {
    id: 7,
    tipTitle: 'Use Encryption',
    tipText: "Encrypt sensitive files to protect them from unauthorized access.",
  },
  {
    id: 8,
    tipTitle: 'Regularly Back Up Your Data',
    tipText: 'Keep copies of your important files on an external hard drive or cloud service.',
  },
  {
    id: 9,
    tipTitle: 'Enable Security Features on Your Devices',
    tipText: "Activate features like screen lock, fingerprint scanning, or facial recognition.",
  },
  {
    id: 10,
    tipTitle: 'Be Cautious with Personal Information',
    tipText: "Avoid oversharing on social media and only provide personal info to trusted sites.",
  },
];

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratRegular = 'Montserrat-Regular';

const fontIceLandRegular = 'Iceland-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const [isHidePasswordEnabled, setHidePasswordEnabled] = useState(true);
  const [isVibrationEnabled, setVibrationEnabled] = useState(true);
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [favoritesTips, setFavoritesTips] = useState([]);
  const [selectedEventCategory, setSelectedEventCategory] = useState('Markets');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const scrollViewRef = useRef(null);
  const [generatedPassword, setGeneratedPassword] = useState('****_****_****');

  const [randomTip, setRandomTip] = useState(null);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const loadedReminders = await loadReminders();
      setReminders(loadedReminders);
    };

    fetchReminders();
  }, [reminders, selectedScreen]);


  const loadReminders = async () => {
    try {
      const reminders = await AsyncStorage.getItem('reminders');
      return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
      console.error('Error loading reminders:', error);
      return [];
    }
  };




  useEffect(() => {
    const randTip = securityTips[Math.floor(Math.random() * securityTips.length)];
    setRandomTip(randTip);
  }, [])

  useEffect(() => {
    const fetchStorageFavourites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favoritesTips');
        setFavoritesTips(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Error  favoritesTips:', error);
      }
    };

    fetchStorageFavourites();

  }, [selectedScreen,]);



  const saveFavourite = async (favourite) => {
    try {
      const savedFav = await AsyncStorage.getItem('favoritesTips');
      const parsedFav = savedFav ? JSON.parse(savedFav) : [];

      const favIndex = parsedFav.findIndex((fav) => fav.id === favourite.id);

      if (favIndex === -1) {
        const updatedFavs = [favourite, ...parsedFav];
        await AsyncStorage.setItem('favoritesTips', JSON.stringify(updatedFavs));
        setFavoritesTips(updatedFavs);
        console.log('favourite збережена');
      } else {
        const updatedFavs = parsedFav.filter((fav) => fav.id !== favourite.id);
        await AsyncStorage.setItem('favoritesTips', JSON.stringify(updatedFavs));
        setFavoritesTips(updatedFavs);
        console.log('favourite видалена');
      }
    } catch (error) {
      console.error('Помилка збереження/видалення tipp:', error);
    }
  };

  const isTipFavorite = () => {
    return favoritesTips.some((fav) => fav.id === randomTip.id);
  };


  const loadSettings = async () => {
    try {
      const hidePasswordValue = await AsyncStorage.getItem('isHidePasswordEnabled');
      const vibrationValue = await AsyncStorage.getItem('isVibrationEnabled');
      const notificationValue = await AsyncStorage.getItem('isNotificationEnabled');

      if (hidePasswordValue !== null) setHidePasswordEnabled(JSON.parse(hidePasswordValue));
      if (vibrationValue !== null) setVibrationEnabled(JSON.parse(vibrationValue));
      if (notificationValue !== null) setNotificationEnabled(JSON.parse(notificationValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    console.log('favoritesTips:', favoritesTips);
  }, [favoritesTips]);

  useEffect(() => {
    loadSettings();
  }, [isNotificationEnabled, selectedScreen]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedEventCategory]);


  const shareTip = async () => {
    try {
      if (!randomTip) {
        Alert.alert('Error', 'No tip here');
        return;
      }
      await Share.share({
        message: `Read security tip about '${randomTip.tipTitle}'`,
      });
    } catch (error) {
      console.error('Error tip:', error);
    }
  };


  const removeReminder = async (reminderToRemove) => {
    try {
      const updatedReminders = reminders.filter(rem =>
        !(rem.id === reminderToRemove.id)
      );
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error removing reminder:', error);
      Alert.alert('Error', 'Failed to remove reminder from reminders.');
    }
  };


  const calculateRemainingDays = (dateAdded, frequency) => {
    const currentDate = new Date();
    const addedDate = new Date(dateAdded);
    const diffTime = Math.abs(currentDate - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(frequency - diffDays, 0) + 1;
  };


  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#000000',
      width: dimensions.width
    }}>
      <View style={{
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF1A1A',
        paddingBottom: dimensions.height * 0.0025,
        borderRadius: dimensions.width * 0.05,
      }}>

        <View style={{
          width: '100%',
          alignSelf: 'center',
          paddingTop: dimensions.height * 0.057,
          paddingHorizontal: dimensions.width * 0.05,
          paddingVertical: dimensions.height * 0.01,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: dimensions.width * 0.01,
          alignItems: 'center',
          backgroundColor: '#151515',
          borderRadius: dimensions.width * 0.05,
        }}>
          <Image
            source={require('../assets/images/leonHomeLogo.png')}
            style={{
              // width: dimensions.width * 0.52,
              // height: dimensions.height * 0.088,

              width: selectedScreen === 'Saved' ? dimensions.height * 0.52 : dimensions.width * 0.52,
              height: selectedScreen === 'Saved' ?  dimensions.height * 0.18 : dimensions.height * 0.088,
              marginVertical: dimensions.height * 0.01,
            }}
            resizeMode='stretch'
          />

          <TouchableOpacity
            style={{
              backgroundColor: selectedScreen === 'Settings' ? '#FF1A1A' : '#0F0F0F',
              padding: dimensions.height * 0.0061,
              borderRadius: dimensions.width * 0.03,
            }}

            onPress={() => {
              setSelectedScreen("Settings")
            }}>
            <Image
              source={require('../assets/icons/settingsIcon.png')}
              style={{
                textAlign: 'center',
                height: dimensions.height * 0.023,
                width: dimensions.height * 0.023,
                margin: dimensions.height * 0.014,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

        </View>
      </View>

      {selectedScreen === 'Home' ? (
        <View style={{
          width: dimensions.width,
        }}>

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: dimensions.height * 0.025,
              width: '100%',
            }}
          >
            <View style={{ marginBottom: dimensions.height * 0.25, width: dimensions.width * 0.9, alignSelf: 'center' }}>

              <Text
                style={{
                  fontFamily: fontIceLandRegular,
                  textAlign: "left",
                  fontSize: dimensions.width * 0.07,
                  fontWeight: 400,
                  color: 'white',
                  
                  textTransform: 'uppercase',
                }}
              >
                my reminders:
              </Text>



              {reminders.length === 0 ? (
                <TouchableOpacity
                  onPress={() => setSelectedScreen('NewReminder')}
                  style={{
                    backgroundColor: '#1E1E1E',
                    width: dimensions.width * 0.9,
                    paddingHorizontal: dimensions.width * 0.03,
                    borderRadius: dimensions.width * 0.037,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: dimensions.height * 0.007,
                    borderColor: 'white',
                    borderWidth: dimensions.width * 0.0025,
                    height: dimensions.height * 0.16,
                    marginTop: dimensions.height * 0.019,
                  }}
                >
                  <Image
                    source={require('../assets/icons/plusIcon.png')}
                    style={{
                      width: dimensions.height * 0.025,
                      height: dimensions.height * 0.025,

                    }}
                    resizeMode='contain'
                  />

                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      fontSize: dimensions.width * 0.04,
                      color: '#A4A4A4',
                      paddingTop: dimensions.width * 0.03,
                      fontWeight: 400,
                      textAlign: 'center',
                      paddingHorizontal: dimensions.width * 0.2,
                    }}
                  >
                    There is no reminders now, add new?
                  </Text>

                </TouchableOpacity>

              ) : (
                <View
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
                    justifyContent: 'space-between',
                  }}>
                    <Text
                      style={{
                        fontFamily: fontMontserratRegular,
                        fontSize: dimensions.width * 0.043,
                        color: 'white',

                        fontWeight: 700,
                        textAlign: 'left',
                        maxWidth: dimensions.width * 0.7,
                      }}
                    >
                      {reminders[reminders.length - 1].title}
                    </Text>

                    <TouchableOpacity onPress={() => {
                      removeReminder(reminders[0]);
                    }}>
                      <Image
                        source={require('../assets/icons/deleteIcon.png')}
                        style={{
                          width: dimensions.height * 0.025,
                          height: dimensions.height * 0.025,
                          marginRight: dimensions.width * 0.019,

                        }}
                        resizeMode='contain'
                      />

                    </TouchableOpacity>

                  </View>
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      fontSize: dimensions.width * 0.04,
                      color: 'white',
                      paddingTop: dimensions.width * 0.03,
                      fontWeight: 400,
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      maxWidth: dimensions.width * 0.7,
                    }}
                  >
                    {reminders[0].comment ? reminders[0].comment : 'No comment'}
                  </Text>


                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingBottom: dimensions.width * 0.03,
                    width: dimensions.width * 0.8,
                    marginTop: dimensions.height * 0.02,
                  }}>
                    <TouchableOpacity
                      onPress={() => { }}
                      style={{
                        width: dimensions.width * 0.28,
                        paddingVertical: dimensions.width * 0.03,
                        backgroundColor: '#FF1A1A',
                        alignItems: 'center',
                        borderRadius: dimensions.width * 0.03,
                        justifyContent: 'center',
                      }}>
                      <Text style={{
                        fontFamily: fontMontserratRegular,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'center',

                      }}
                      >
                        {calculateRemainingDays(reminders[0].dateAdded, reminders[0].frequency)} Days
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: fontMontserratRegular,
                        fontSize: dimensions.width * 0.04,
                        color: 'white',
                        fontWeight: 400,
                        textAlign: 'left',
                        marginLeft: dimensions.width * 0.03,
                      }}
                    >
                      to change
                    </Text>

                  </View>

                </View>
              )}



              <Text
                style={{
                  fontFamily: fontIceLandRegular,
                  fontSize: dimensions.width * 0.07,
                  color: 'white',
                  paddingTop: dimensions.width * 0.03,
                  fontWeight: 400
                }}
              >
                Online Security TIPS:
              </Text>

              <View
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
                    {randomTip?.tipTitle}
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
                  {randomTip?.tipText}
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
                    onPress={() => saveFavourite(randomTip)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: isTipFavorite() ? '#FF1A1A' : '#0F0F0F',
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
                      {!isTipFavorite() ? 'Save' : 'Saved'}
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
                    onPress={() => {
                      // shareTip();

                      shareMessage();
                    }}
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
            </View>
          </ScrollView>










        </View>
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} isNotificationEnabled={isNotificationEnabled} setNotificationEnabled={setNotificationEnabled}
          isHidePasswordEnabled={isHidePasswordEnabled} setHidePasswordEnabled={setHidePasswordEnabled}
          isVibrationEnabled={isVibrationEnabled} setVibrationEnabled={setVibrationEnabled}
        />
      ) : selectedScreen === 'Password Generator' ? (
        <PassGeneratorScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} isHidePasswordEnabled={isHidePasswordEnabled}
        generatedPassword={generatedPassword} setGeneratedPassword={setGeneratedPassword} isVibrationEnabled={isVibrationEnabled}
        />
      ) : selectedScreen === 'NewReminder' ? (
        <NewReminderScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Tips' ? (
        <TipsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} securityTips={securityTips} favoritesTips={favoritesTips} setFavoritesTips={setFavoritesTips} />
      ) : selectedScreen === 'Saved' ? (
        <SavedTipsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} favoritesTips={favoritesTips} setFavoritesTips={setFavoritesTips} />
      ) : null}


      <View
        style={{
          position: 'absolute',
          bottom: dimensions.height * 0.035,
          backgroundColor: '#1E1E1E',
          width: dimensions.width * 0.9,
          paddingHorizontal: dimensions.width * 0.03,
          borderRadius: dimensions.width * 0.037,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          paddingVertical: dimensions.height * 0.007,
          zIndex: 5000,
          borderColor: 'white',
          borderWidth: dimensions.width * 0.0025,
        }}
      >
        {homePagesbottomIconsScr.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedScreen(button.screenTitle)}
            style={{
              borderRadius: dimensions.width * 0.03,
              padding: dimensions.height * 0.019,
              margin: dimensions.height * 0.003,
              alignItems: 'center',
              marginHorizontal: 5,
              backgroundColor: selectedScreen === button.screenTitle ? '#FF1A1A' : '#0F0F0F',
              shadowColor: '#000',
              shadowOffset: {
                width: dimensions.width * 0.01,
                height: dimensions.height * 0.01,
              },
              shadowOpacity: 0.3,
            }}
          >
            <Image
              source={button.screenIcon}
              style={{
                width: dimensions.height * 0.025,
                height: dimensions.height * 0.025,

                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

      </View>
    </View>
  );
};

export default HomeScreen;
