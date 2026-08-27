import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCalendars } from 'expo-localization'
import styles from '../../style/Onboarding.styles';

const ORDINALS = { 2: 'Second', 3: 'Third' };

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

export default function ScheduleScreen({ onSignInPress, onGoToNotificationPress, setBytesPerDay, bytesPerDay, setDeliveryTime, deliveryTime, setTimeZone })
{
    const options = [1, 2, 3];
    const [activeSlot, setActiveSlot] = useState(null);

    const isLocked = {
        1: true,
        2: true,
        3: true
    };

    for (var i = 1; i <= bytesPerDay; i++)
    {
        isLocked[i] = false;
    }

    useEffect(() => {
        if (bytesPerDay == 1)
        {
            setDeliveryTime(prev => ({...prev, delivery2: null, delivery3: null}));
        }

        if (bytesPerDay == 2)
        {
            setDeliveryTime(prev => ({...prev, delivery3: null}));
        }

    }, [bytesPerDay]);

    useEffect(() => {
        // getCalendars() returns an array prioritized by user settings.
        // The first item [0] represents their active preference.
        const calendars = getCalendars();
    
        if (calendars && calendars.length > 0) {
        const timeZone = calendars[0].timeZone; // Returns e.g., "America/New_York"
        setTimeZone(timeZone);
        }
    }, []);

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

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.scheduleTop}>
                <View style={styles.progressTrack}>
                    <View style={styles.progressFill} />
                </View>

                <Text style={styles.scheduleHeading}>How often, and when?</Text>

                <Text style={styles.sectionLabel}>Bytes per day</Text>
                <View style={styles.byteSelector}>
                    {options.map(n => (
                        <Pressable
                            key={n}
                            onPress={() => setBytesPerDay(n)}
                            style={[
                                styles.byteOption,
                                bytesPerDay === n && styles.byteOptionSelected,
                            ]}
                        >
                            <Text style={[
                                styles.byteOptionText,
                                bytesPerDay === n && styles.byteOptionTextSelected,
                            ]}>{n}</Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Delivery time</Text>
                {options.map(n => {
                    const key = `delivery${n}`;
                    const value = deliveryTime?.[key];

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
                                    onChange={(event, selectedDate) => handleTimeChange(n, event, selectedDate)}
                                />
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={styles.actions}>
                <Pressable
                    disabled={isScheduleIncomplete}
                    onPress={onGoToNotificationPress}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        isScheduleIncomplete && styles.primaryButtonDisabled,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                </Pressable>
                <Pressable
                    onPress={onSignInPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Already have an account? Sign in</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}
