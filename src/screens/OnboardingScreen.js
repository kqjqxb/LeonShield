import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import leonShieldOnboardingData from '../components/leonShieldOnboardingData';
import { useNavigation } from '@react-navigation/native';

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratRegular = 'Montserrat-Regular';

const fontIceLandRegular = 'Iceland-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
  
    const dimensionListener = Dimensions.addEventListener('change', onChange);
  
    return () => {
      dimensionListener.remove(); 
    };
  }, []);
  



  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextLeonSlide = () => {
    if (currentSlideIndex < leonShieldOnboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentSlideIndex + 1 });
    } else {
      navigation.navigate('Home'); 
    }
  };


  const renderLeonItem = ({ item }) => (
    <View style={{ width: dimensions.width, flex: 1, justifyContent: 'space-between', alignItems: 'center' }} >
      <View style={{
        width: dimensions.width,
        height: dimensions.height * 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '7%'
      }}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={{
            marginTop: dimensions.height * 0.03,
            height: '100%',
            width: '91%',
          }}
        />

      </View>
      <View style={{
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(255, 26, 26, 1)',
        height: dimensions.height * 0.435,  
        zIndex: 0, 
        width: dimensions.width, 
        alignSelf: 'center',  
        borderTopLeftRadius: dimensions.width * 0.035, 
        borderTopRightRadius: dimensions.width * 0.035
      }}/>
      <View style={{
          alignItems: 'center', 
          height: dimensions.height * 0.43,  
          zIndex: 1, 
          width: '100%', 
          alignSelf: 'center',  
          backgroundColor: 'rgba(30, 30, 30, 1)',
          borderTopLeftRadius: dimensions.width * 0.035, 
          borderTopRightRadius: dimensions.width * 0.035
        }}>
        <Text
        style={{ 
          fontSize: dimensions.width * 0.08, 
          fontFamily: fontIceLandRegular, 
          maxWidth: '70%',
          color: 'white',
          marginTop: 21,
          textAlign: 'center',
          fontWeight: 700,
          // lineHeight: dimensions.height * 0.03,
        }}>
          {item.title}
        </Text>
        <Text 
          style={{ fontFamily: fontMontserratRegular, 
          fontSize: dimensions.width * 0.035,
          top: dimensions.height * 0.019,
          paddingHorizontal: 21,
          color: 'white',
          textAlign: 'center',
          marginTop: 8,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View 
      style={{justifyContent: 'space-between', flex: 1, backgroundColor: '#121212', alignItems: 'center',}}
    >
      <View style={{display: 'flex'}}>
        <FlatList
          data={leonShieldOnboardingData}
          renderItem={renderLeonItem}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if(currentSlideIndex === leonShieldOnboardingData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextLeonSlide();
        }}
        style={{
          bottom: dimensions.height * 0.16,
          backgroundColor: '#FF1A1A',
          borderRadius: dimensions.width * 0.03,
          paddingVertical: 21,
          paddingHorizontal: 28,
          marginBottom: 40,
          alignSelf: 'center',
          width: dimensions.width * 0.5,
        }}
      >
        <Text
          style={{ 
            fontFamily: fontMontserratBold, 
            color: 'white', 
            fontSize: dimensions.width * 0.043, 
            textAlign: 'center', 
            fontWeight: 700 
        }}>
            {currentSlideIndex === 0 ? 'Start' : 'Next'}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default OnboardingScreen;
