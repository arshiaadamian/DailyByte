import {View, Text, Pressable, TextInput, ActivityIndicator} from 'react-native';
import styles from '../style/Settings.styles';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCalendars } from 'expo-localization'


// update preference API
import { updatePreferences, getUserInformation } from '../api/bytes';



function formatClock(date)
{
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function periodLabel(date)
{
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
}

export default function SettingsScreen()
{

    const { signOut, user, getIdToken } = useAuth();

    const [error, setError] = useState(null);
    const [preferenceError, setPreferenceError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // update preferences
    const [topic, setTopic] = useState(null);
    const [bytesPerDay, setBytesPerDay] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [original, setOriginal] = useState(null);
    const isLocked = {
        1: true,
        2: true,
        3: true
    };

    const topics = [
        { label: "Personal Finance", value: "Personal Finance" },
        { label: "Psychology", value: "Psychology" },
        { label: "Space & Astronomy", value: "Space & Astronomy" },
        { label: "World History", value: "World History" },
        { label: "Nutrition Science", value: "Nutrition Science" },
        { label: "Cooking & Food Science", value: "Cooking & Food Science" },
        { label: "Philosophy", value: "Philosophy" },
        { label: "Etymology & Word Origins", value: "Etymology & Word Origins" },
        { label: "Sleep & Energy", value: "Sleep & Energy" },
        { label: "Geopolitics", value: "Geopolitics" }
    ];

    const bytesOptions = [
        { label: "1 byte per day", value: 1 },
        { label: "2 bytes per day", value: 2 },
        { label: "3 bytes per day", value: 3 }
    ];


    async function handleSignOut()
    {
        try
        {
            setSubmitting(true);
            setError(null);
            await signOut();
        }
        catch (err)
        {
            setSubmitting(false);
            setError(err.message ?? 'Could not sign out');
        }
    }

    async function handleUpdatePreferences()
    {
        if (!topic && !bytesPerDay)
        {
            setError("Pick a topic or bytes per day first");
            return;
        }

        const payload = {};
        
        if (topic)
        {
            payload.topic = topic;
        }

        if (bytesPerDay)
        {
            payload.bytesPerDay = bytesPerDay;
        }

        try
        {
            setError(null);
            const token = await getIdToken();
            // console.log("token is: ", token);
            setLoading(true);
            await updatePreferences(token, payload);
            setSuccessMessage("Successfully updated your preferences");
        }
        catch (err)
        {
            setPreferenceError(err.message ?? "Could not save preferences");
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function getInformation()
        {
            try 
            {
                setLoading(true);
                setError(null);
                const token = await getIdToken();
                const data = await getUserInformation(token);
                // console.log(data);

                if (!cancelled)
                {
                    setTopic(data.message.topic);
                    setBytesPerDay(data.message.bytesPerDay);
                    setDeliveryTime(data.message.deliveryTime);

                    setOriginal({
                        topic: data.message.topic,
                        bytesPerDay: data.message.bytesPerDay,
                        setDeliveryTime: data.message.deliveryTime
                    });
                }

                // console.log("delivery is: " , deliveryTime);
                // console.log("Bytes per day is: " , bytesPerDay);
            }
            catch (err)
            {
                if (!cancelled)
                {
                    setError(err.message);
                }           
            }
            finally
            {
                if (!cancelled)
                {
                    setLoading(false);
                }
            }
        }

        getInformation();
        return () => { cancelled = true }

    }, []);

    // useEffect to set which bytes should be locked when changed
    useEffect(() => {

        for (var i = 1; i <= bytesPerDay; i++)
        {
            isLocked[i] = false;
        }

        if (bytesPerDay == 1)
        {
            setDeliveryTime(prev => {
                const next = [...prev];
                next[1] = null;
                next[2] = null;

                return next;
            });
        }
        else if (bytesPerDay == 2)
        {
            setDeliveryTime(prev => {
                const next = [...prev];
                next[2] = null;

                return next;
            });
        }

        console.log("Bytes per day is: " , bytesPerDay);
        console.log("isLocked: ", isLocked);
    }, [bytesPerDay]);

    // for testing
    useEffect(() => {
        console.log("delivery is now:", deliveryTime);
    }, [deliveryTime]);

    if (loading)
    {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#816148" />
            </View>
        );
    }

    // start from here Arshia, understand the following two.
    const isScheduleIncomplete = options.some(n => !isLocked[n] && !deliveryTime?.[`delivery${n}`]);
    function handleTimeChange(slot, event, selectedDate)
    {
        if (Platform.OS === 'android')
        {
            setActiveSlot(null);
        }

        if (event.type === 'dismissed')
        {
            return;
        }

        if (selectedDate)
        {
            setDeliveryTime(prev => ({...prev, [`delivery${slot}`]: selectedDate}));
        }
    }


    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Topic</Text>
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            itemTextStyle={styles.dropdownItemText}
                            activeColor={styles.card.backgroundColor}
                            data={topics}
                            labelField="label"
                            valueField="value"
                            value={topic}
                            placeholder="Choose a topic"
                            onChange={item => setTopic(item.value)}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Bytes Per Day</Text>
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            itemTextStyle={styles.dropdownItemText}
                            activeColor={styles.card.backgroundColor}
                            data={bytesOptions}
                            labelField="label"
                            valueField="value"
                            value={bytesPerDay}
                            placeholder="How many per day?"
                            onChange={item => setBytesPerDay(item.value)}
                        />
                    </View>

                    <View>
                        <Text>Current byte delivery times</Text>
                        {deliveryTime.map((item, index) => {
                            if (item == null) return null;
                            return (
                                <Text
                                    key={index}
                                >Delivery: hour: {item.hour}, minute: {item.minute}</Text>
                            );
                        })}
                    </View>
                </View>

                <Pressable
                    onPress={handleUpdatePreferences}
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                </Pressable>

                {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
                {preferenceError && <Text style={styles.preferenceError}>{preferenceError}</Text>}

            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Signed in as</Text>
                <Text style={styles.value}>{user?.signInDetails?.loginId ?? '-'}</Text>
            </View>
            <View style={styles.signOutArea}>
                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable
                    onPress={handleSignOut}
                    disabled={submitting}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                        submitting && styles.buttonDisabled,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {submitting ? 'Signing out…' : 'Sign out'}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}