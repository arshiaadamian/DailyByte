import {View, Text, Pressable, TextInput, ActivityIndicator} from 'react-native';
import styles from '../style/Settings.styles';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';


// update preference API
import { updatePreferences, getUserInformation } from '../api/bytes';

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

    const topics = [
        { label: "Cooking & Kitchen Skills", value: "Cooking & Kitchen Skills" },
        { label: "Space & Astronomy", value: "Space & Astronomy" },
        { label: "Personal Finance", value: "Personal Finance" },
        { label: "World History", value: "World History" },
        { label: "Spanish Vocabulary", value: "Spanish Vocabulary" },
        { label: "English Vocabulary", value: "English Vocabulary" },
        { label: "Psychology", value: "Psychology" },
        { label: "Health & Nutrition", value: "Health & Nutrition" },
        { label: "Music Theory", value: "Music Theory" },
        { label: "Photography", value: "Photography" },
        { label: "HTTP & Web Protocols", value: "HTTP & Web Protocols" },
        { label: "AWS Cloud Services", value: "AWS Cloud Services" },
        { label: "Philosophy", value: "Philosophy" },
        { label: "Chess Strategy", value: "Chess Strategy" },
        { label: "Gardening", value: "Gardening" }
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
            await updatePreferences(token, payload);
            setSuccessMessage("Successfully updated your preferences");
        }
        catch (err)
        {
            setPreferenceError(err.message ?? "Could not save preferences");
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
                console.log(data);

                if (!cancelled)
                {
                    setTopic(data.message.topic);
                    setBytesPerDay(data.message.bytesPerDay);
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

    if (loading)
    {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#816148" />
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Signed in as</Text>
                <Text style={styles.value}>{user?.signInDetails?.loginId ?? '-'}</Text>
            </View>

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
        </View>
    )
}