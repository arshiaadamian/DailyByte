// CHANGED: added Platform import, needed by handleTimeChange below (it was used but never imported before)
// CHANGED: added ScrollView so the page can scroll instead of squeezing/pushing the buttons off screen
import {View, Text, Pressable, TextInput, ActivityIndicator, Platform, ScrollView} from 'react-native';
import styles from '../style/Settings.styles';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';


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

// NEW: labels for the locked-slot message, same as Schedule.js (slot 1 is never locked, so no entry for it)
const ORDINALS = { 2: 'Second', 3: 'Third' };

export default function SettingsScreen()
{

    const { signOut, user, getIdToken } = useAuth();

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // update preferences
    const [topic, setTopic] = useState(null);
    const [bytesPerDay, setBytesPerDay] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [activeSlot, setActiveSlot] = useState(null); // NEW: tracks which delivery-time picker is currently open (like Schedule.js)

    // NEW: byte slot numbers, and which ones are locked based on bytesPerDay.
    // Recomputed fresh on every render (same approach as Schedule.js) so it never goes stale.
    const options = [1, 2, 3];
    const isLocked = {
        1: true,
        2: true,
        3: true
    };
    for (let i = 1; i <= bytesPerDay; i++)
    {
        isLocked[i] = false;
    }


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

        if (deliveryTime)
        {
            // CHANGED: send only the unlocked slots, and send them as { hour, minute } numbers.
            // handleTimeChange (below) already converts the picked Date into .getHours()/.getMinutes()
            // when it's saved into deliveryTime, so this is just grabbing that already-converted data.
            payload.deliveryTime = deliveryTime.slice(0, bytesPerDay);
        }

        try
        {
            setError(null);
            const token = await getIdToken();
            // console.log("token is: ", token);
            setLoading(true);
            // CHANGED: removed the response.statusCode check - updatePreferences() (api/bytes.js)
            // already throws (caught below) for any non-2xx response, so reaching this line means
            // it succeeded. response.statusCode doesn't exist anyway: the Lambda's statusCode is
            // consumed by API Gateway to set the actual HTTP status and never appears in the JSON
            // body, so that check was always false and every successful save was showing as an error.
            const response = await updatePreferences(token, payload);
            setMessage(response.message);
        }
        catch (err)
        {
            setMessage(null);
            setError(err.message ?? "Could not save preferences");
        }
        finally
        {
            setLoading(false);
        }
    }

    // get user's data
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
                }
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

    // for testing
    // CHANGED: brought this back, but logging bytesPerDay directly instead of bytesPerDay.slice(...) -
    // bytesPerDay is a number, not an array, so .slice() on it was what crashed with "read property of null".
    useEffect(() => {
        // console.log("isLocked: ", isLocked);
        // console.log("Bytes per day is: ", bytesPerDay);
        // console.log("topic is: ", topic);
        // console.log("delivery is now:", deliveryTime.slice(0, bytesPerDay));
    }, [deliveryTime, topic, bytesPerDay]);

    if (loading)
    {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#816148" />
            </View>
        );
    }

    // CHANGED: only require a time for the slots that are actually unlocked (matches Schedule.js logic),
    // instead of requiring all 3 array entries to be filled in.
    const isScheduleIncomplete = !bytesPerDay || options.some(n => !isLocked[n] && !deliveryTime?.[n - 1]);

    function handleTimeChange(index, event, selectedDate)
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
            // CHANGED: build a fixed 3-slot array instead of `.map`-ing over prev directly.
            // `.map()` only transforms indexes that already exist - if prev came back from the
            // server shorter than 3 items (e.g. it only had 2 saved from when bytesPerDay was 2),
            // picking a time for the new 3rd slot (index 2) would silently do nothing, since
            // `.map()` can't add a new index. Reading prev?.[i] for all 3 slots up front avoids that.
            setDeliveryTime(prev => {
                const next = [prev?.[0] ?? null, prev?.[1] ?? null, prev?.[2] ?? null];
                next[index] = { hour: selectedDate.getHours(), minute: selectedDate.getMinutes() };
                return next;
            });
        }
    }


    return(
        <View style={styles.root}>
            {message && (
                <View style={[styles.banner, styles.bannerSuccess]}>
                    <Text style={[styles.bannerText, styles.bannerTextSuccess]}>{message}</Text>
                </View>
            )}
            {error && (
                <View style={[styles.banner, styles.bannerError]}>
                    <Text style={[styles.bannerText, styles.bannerTextError]}>{error}</Text>
                </View>
            )}

            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Delivery time</Text>
                            {options.map(n => {
                                const index = n - 1; // deliveryTime array is 0-indexed, slot numbers are 1-indexed
                                const stored = deliveryTime?.[index];
                                const value = stored ? new Date(1970, 0, 1, stored.hour, stored.minute) : null;

                                if (isLocked[n])
                                {
                                    return (
                                        <View key={n} style={styles.lockedRow}>
                                            <Text style={styles.lockedRowText}>
                                                {ORDINALS[n]} slot unlocks at {n} bytes per day
                                            </Text>
                                        </View>
                                    );
                                }

                                return (
                                    <View key={n}>
                                        <Pressable
                                            onPress={() => setActiveSlot(activeSlot === n ? null : n)}
                                            style={styles.deliveryRow}
                                        >
                                            <Text style={styles.deliveryRowLabel}>
                                                {value ? periodLabel(value) : 'Set a time'}
                                            </Text>
                                            {value && (
                                                <Text style={styles.deliveryRowValue}>{formatClock(value)}</Text>
                                            )}
                                        </Pressable>
                                        {activeSlot === n && (
                                            <DateTimePicker
                                                value={value ?? new Date(1970, 0, 1, 8, 0)}
                                                mode="time"
                                                is24Hour={false}
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={(event, selectedDate) => handleTimeChange(index, event, selectedDate)}
                                            />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <Pressable
                        onPress={handleUpdatePreferences}
                        disabled={isScheduleIncomplete}
                        style={({ pressed }) => [
                            styles.saveButton,
                            isScheduleIncomplete && styles.buttonDisabled,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    </Pressable>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Signed in as</Text>
                    <Text style={styles.value}>{user?.signInDetails?.loginId ?? '-'}</Text>
                </View>
                <View style={styles.signOutArea}>
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
            </ScrollView>
        </View>
    )
}