import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import {useState} from 'react';
import styles from '../../style/Onboarding.styles';
import NotificationImage from '../../assets/notification-preview.svg';

// what allows you to communicate with iphone notifications from your code
import * as Notifications from 'expo-notifications';

// project id from app.json
import Constants from 'expo-constants';



export default function NotificationScreen({ onSignInPress, onSignUpPress, onBack, setPushToken })
{

    // function to get notification permission and pushToken, if user denies this, it will never pop up again, and user must 
    async function registerForPush()
    {
        const currentNotificationState = await Notifications.getPermissionsAsync();
        let status = currentNotificationState.status;
        // console.log("currentNotification is: ", status);

        if (status !== 'granted' && currentNotificationState.canAskAgain != false)
        {
            const result = await Notifications.requestPermissionsAsync();
            status = result.status
            console.log("after permission set: ", status);
        }


        if (status === 'granted')
        {
            const projectId = Constants.expoConfig.extra.eas.projectId;
            const token = await Notifications.getExpoPushTokenAsync({ projectId });
            const tokenData = token.data;
            console.log("token is: ", tokenData);
            setPushToken(tokenData);
        }
        else 
        {
            // point them to Settings
            Linking.openSettings();
        }
    }


    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.notificationTop}>
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                    ]}
                >
                    <Text style={styles.backButtonText}>back</Text>
                </Pressable>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '85%' }]} />
                </View>
                <Text style={styles.notificationHeading}>This is the whole app.</Text>
                <Text style={styles.notificationSubheading}>Your bytes arrive as notifications.{"\n"}You never have to open anything.</Text>
                <View style={styles.notificationCard}>
                    <NotificationImage width="100%" height="100%" />
                </View>
                <Text style={styles.notificationCaption}>You choose how many bytes{"\n"} a day, and when they arrive.{"\n"}Nothing else, ever.</Text>
            </View>
            <View style={styles.actions}>
                <Pressable
                    onPress={registerForPush}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Turn on notifications</Text>
                </Pressable>
                <Pressable
                    onPress={onSignUpPress}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.secondaryButtonPressed,
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>Continue</Text>
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