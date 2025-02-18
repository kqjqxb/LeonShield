import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert, Switch, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBold = 'Montserrat-Bold';
const fontIceLandRegular = 'Iceland-Regular';

const NewReminderScreen = ({ selectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState(0);
    const [comment, setComment] = useState('');
    const [isAddingNewReminder, setIsAddingNewReminder] = useState(false);
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


    const saveReminder = async (title, frequency, comment) => {
        const maxId = reminders.length > 0 ? Math.max(...reminders.map(rem => rem.id)) : 0;
        try {
            const newReminder = {
                title,
                frequency,
                comment: comment || '',
                dateAdded: new Date().toISOString(),
                id: maxId + 1,
            };

            const existingReminders = await AsyncStorage.getItem('reminders');
            const reminders = existingReminders ? JSON.parse(existingReminders) : [];
            reminders.unshift(newReminder);

            await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
        } catch (error) {
            console.error('Error saving reminder:', error);
            Alert.alert('Error', 'Failed to add reminder');
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

    

    const addFrequency = () => {
        setFrequency((prev) => prev + 1);
    }

    const removeFrequency = () => {
        setFrequency((prev) => prev - 1);
    }

    const calculateRemainingDays = (dateAdded, frequency) => {
        const currentDate = new Date();
        const addedDate = new Date(dateAdded);
        const diffTime = Math.abs(currentDate - addedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(frequency - diffDays, 0) + 1;
    };


    return (
        <SafeAreaView style={{ marginBottom: 100, width: dimensions.width * 0.9, }}>

            <TouchableOpacity
                onPress={() => {
                    setIsAddingNewReminder(false);
                    setTitle('');
                    setFrequency(0);
                    setComment('');
                }}
                disabled={!isAddingNewReminder}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: dimensions.height * 0.025,
                }}>
                {isAddingNewReminder && (
                    <ChevronLeftIcon size={dimensions.height * 0.035} color='white' />
                )}
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
                    {isAddingNewReminder ? 'new reminder:' : 'my reminders:'}
                </Text>
            </TouchableOpacity>


            {isAddingNewReminder ? (
                <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                }}>
                    <Text style={{
                        fontFamily: fontMontserratRegular,
                        color: '#A4A4A4',
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                        textAlign: 'center',
                        marginTop: dimensions.height * 0.025,
                    }}
                    >
                        Reminder title:
                    </Text>


                    <TextInput
                        placeholder="Website/Codename other..."
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="rgba(255, 255, 255, 0.61)"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.25)',
                            borderWidth: dimensions.width * 0.004,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: dimensions.width * 0.035,
                            paddingHorizontal: dimensions.width * 0.04,
                            backgroundColor: '#1E1E1E',
                            borderRadius: dimensions.width * 0.023,
                            width: '100%',
                            color: 'white',
                            fontFamily: fontMontserratRegular,
                            fontSize: dimensions.width * 0.041,
                            fontWeight: 300,
                            textAlign: 'left',
                            marginTop: dimensions.height * 0.01,

                        }}
                    />


                    <Text style={{
                        fontFamily: fontMontserratRegular,
                        color: '#A4A4A4',
                        fontWeight: 400,
                        fontSize: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                        textAlign: 'center',
                        marginTop: dimensions.height * 0.025,
                    }}
                    >
                        Reminder frequency:
                    </Text>

                    <View style={{
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                        borderWidth: dimensions.width * 0.004,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: dimensions.width * 0.035,
                        paddingHorizontal: dimensions.width * 0.05,
                        backgroundColor: '#1E1E1E',
                        borderRadius: dimensions.width * 0.023,
                        width: '100%',
                        color: 'white',
                        marginTop: dimensions.height * 0.01,


                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                fontFamily: fontMontserratRegular,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: dimensions.width * 0.055,
                                alignSelf: 'flex-start',
                                textAlign: 'center',

                            }}
                            >
                                {frequency}
                            </Text>
                            <Text style={{
                                fontFamily: fontMontserratRegular,
                                color: 'white',
                                fontWeight: 300,
                                fontSize: dimensions.width * 0.04,
                                alignSelf: 'flex-start',
                                textAlign: 'center',
                                padding: dimensions.width * 0.01,
                            }}
                            >
                                Days
                            </Text>

                        </View>

                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            maxWidth: dimensions.width * 0.25,
                            flex: 1,
                        }}>
                            <TouchableOpacity
                                onPress={addFrequency}
                                style={{
                                    backgroundColor: '#FF1A1A',
                                    padding: dimensions.width * 0.03,
                                    borderRadius: dimensions.width * 0.03,
                                    alignSelf: 'center',
                                }}>
                                <Image
                                    source={require('../assets/icons/plusRemIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.05,
                                        height: dimensions.width * 0.05,

                                    }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={removeFrequency}
                                disabled={frequency <= 1}
                                style={{
                                    backgroundColor: 'white',
                                    padding: dimensions.width * 0.03,
                                    borderRadius: dimensions.width * 0.03,
                                    alignSelf: 'center',
                                }}>

                                <Image
                                    source={require('../assets/icons/minusIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.05,
                                        height: dimensions.width * 0.05,

                                    }}
                                    resizeMode='contain'
                                />

                            </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: dimensions.width * 0.9,
                        marginTop: dimensions.height * 0.01,
                    }}>
                        {[30, 60, 90].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setFrequency(item)}
                                style={{
                                    width: dimensions.width * 0.28,
                                    paddingVertical: dimensions.width * 0.03,
                                    backgroundColor: item === frequency ? '#FF1A1A' : '#1E1E1E',
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
                                    {item} Days
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>





                    <Text style={{
                        fontFamily: fontMontserratRegular,
                        color: 'white',
                        fontWeight: 300,
                        fontSize: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                        textAlign: 'center',
                        marginTop: dimensions.height * 0.025,
                    }}
                    >
                        Comment:
                    </Text>


                    <TextInput
                        placeholder="(optional)"
                        value={comment}
                        onChangeText={setComment}
                        placeholderTextColor="rgba(255, 255, 255, 0.61)"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.25)',
                            borderWidth: dimensions.width * 0.004,
                            backgroundColor: '#1E1E1E',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: dimensions.height * 0.01,
                            paddingHorizontal: dimensions.width * 0.04,
                            borderRadius: dimensions.width * 0.023,
                            width: '100%',
                            color: 'white',
                            fontFamily: fontMontserratRegular,
                            fontSize: dimensions.width * 0.041,
                            fontWeight: 400,
                            textAlign: 'left',
                            marginTop: dimensions.height * 0.01,
                            height: dimensions.height * 0.1,
                            alignSelf: 'flex-start',
                            textAlignVertical: 'top'
                        }}
                        multiline={true}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            if (title.length > 0 && frequency > 0) {
                                saveReminder(title, frequency, comment);
                                setIsAddingNewReminder(false);
                                setTitle('');
                                setFrequency(0);
                                setComment('');
                            } else {
                                Alert.alert('Error', 'Title and frequency are required');
                            }
                        }}
                        style={{
                            backgroundColor: '#FF1A1A',
                            opacity: title.length > 0 && frequency > 0 ? 1 : 0.5,
                            padding: dimensions.width * 0.05,
                            borderRadius: dimensions.width * 0.03,
                            marginTop: dimensions.width * 0.019,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9,
                            marginTop: dimensions.height * 0.025,
                        }}>
                        <Text style={{
                            color: 'white',
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontMontserratBold,
                            fontWeight: 700,
                            textAlign: 'center',
                        }}>
                            Add new reminder
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    height: dimensions.height,
                }}>
                    {reminders.length === 0 ? (
                        <View style={{
                            width: dimensions.width * 0.9,
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
                                    Add some reminders to see them here!
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <ScrollView style={{
                        }}>
                            <View style={{
                                paddingBottom: dimensions.height * 0.25,
                                marginBottom: dimensions.height * 0.3,
                            }}>

                                {reminders.map((reminder, index) => (
                                    <View
                                        key={reminder.id}
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
                                                {reminder.title}
                                            </Text>

                                            <TouchableOpacity onPress={() => {
                                                removeReminder(reminder);
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
                                            {reminder.comment ? reminder.comment : 'No comment'}
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
                                                    {calculateRemainingDays(reminder.dateAdded, reminder.frequency)} Days
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
                                ))}
                            </View>
                        </ScrollView>

                    )}
                    <TouchableOpacity
                        onPress={() => setIsAddingNewReminder(true)}
                        style={{
                            backgroundColor: '#FF1A1A',
                            padding: dimensions.width * 0.05,
                            borderRadius: dimensions.width * 0.03,
                            marginTop: dimensions.width * 0.019,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9,
                            marginTop: dimensions.height * 0.025,
                            position: 'absolute',
                            bottom: dimensions.height * 0.37,
                        }}>
                        <Text style={{
                            color: 'white',
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontMontserratBold,
                            fontWeight: 700,
                            textAlign: 'center',
                        }}>
                            Add new
                        </Text>
                    </TouchableOpacity>

                </View>
            )}





        </SafeAreaView>
    );
};

export default NewReminderScreen;