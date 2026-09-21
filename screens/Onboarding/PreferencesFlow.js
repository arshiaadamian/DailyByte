import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createUser } from '../../api/bytes';
import { PressableScale } from '../../components/Motion';

// import preference screens
import TopicScreen from './Topic';
import ScheduleScreen from './Schedule';
import NotificationScreen from './Notification';

// CHANGED: these are the preference steps that used to live in OnboardingFlow.
// They now run once the user is already signed in - password or Google, it makes
// no difference - and finish by calling POST /user, instead of smuggling the
// answers through Cognito clientMetadata on confirmSignUp. That old path only
// ever existed for email signups, which is why Google users never got a row.
export default function PreferencesFlow({ onComplete })
{
    const { getIdToken } = useAuth();

    const [screen, setScreen] = useState('topic');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [bytesPerDay, setBytesPerDay] = useState(1);
    const [deliveryTime, setDeliveryTime] = useState({
        delivery1: null,
        delivery2: null,
        delivery3: null
    });
    const [timeZone, setTimeZone] = useState('');
    const [pushToken, setPushToken] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreateProfile()
    {
        const deliveryHours = [deliveryTime.delivery1, deliveryTime.delivery2, deliveryTime.delivery3]
            .filter(delivery => delivery !== null)
            .map(delivery => ({ hour: delivery.getHours(), minute: delivery.getMinutes() }));

        try
        {
            setError(null);
            setSubmitting(true);

            const idToken = await getIdToken();
            await createUser(idToken, {
                topic: selectedTopic,
                bytesPerDay: bytesPerDay,
                deliveryTime: deliveryHours,
                timeZone: timeZone,
                pushToken: pushToken
            });

            // ask App.js to re-run its profile check, which will now find the row.
            // stay in the submitting state - this component unmounts on the next render.
            onComplete();
        }
        catch (err)
        {
            setSubmitting(false);
            setError(err.message ?? "Could not finish setting up your account");
        }
    }

    if (submitting)
    {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#816148" />
                <Text style={styles.statusText}>Setting up your account…</Text>
            </View>
        );
    }

    if (error)
    {
        return (
            <View style={styles.centered}>
                <Text style={styles.statusText}>{error}</Text>
                <PressableScale onPress={handleCreateProfile}>
                    <Text style={styles.retryText}>Try again</Text>
                </PressableScale>
            </View>
        );
    }

    if (screen === 'topic')
    {
        return (
            <TopicScreen
                onGoToSchedule={() => setScreen('schedule')}
                setSelectedTopic={setSelectedTopic}
                selectedTopic={selectedTopic}
            />
        );
    }
    else if (screen === 'schedule')
    {
        return (
            <ScheduleScreen
                onGoToNotificationPress={() => setScreen('notification')}
                setBytesPerDay={setBytesPerDay}
                bytesPerDay={bytesPerDay}
                setDeliveryTime={setDeliveryTime}
                deliveryTime={deliveryTime}
                setTimeZone={setTimeZone}
                onBack={() => setScreen('topic')}
            />
        );
    }
    // this else statement will render the notification page, the last step
    else
    {
        return (
            <NotificationScreen
                onContinue={handleCreateProfile}
                onBack={() => setScreen('schedule')}
                setPushToken={setPushToken}
            />
        );
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E1DED3',
        paddingHorizontal: 32,
    },
    statusText: {
        marginTop: 12,
        marginBottom: 12,
        color: '#2F2E2C',
        textAlign: 'center',
    },
    retryText: {
        color: '#816148',
    },
});
