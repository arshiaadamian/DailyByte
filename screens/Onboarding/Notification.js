import { View, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import {useState} from 'react';
import styles from '../../style/Onboarding.styles';

// A real byte as it arrives, on its dark backdrop.
// NOTE: notification_transparent.png cannot be used here - despite the name it
// has no alpha channel (PNG colour type 2) and its transparency checkerboard is
// baked into the pixels. Re-export it as PNG-32 to use it instead.
const notificationShot = require('../../assets/notification_darkBG.jpg');
import { Daisy } from '../../components/Mascot';
import { FadeIn, PressableScale } from '../../components/Motion';
import { daisy } from '../../assets/mascots';

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
                <PressableScale
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                    ]}
                >
                    <Text style={styles.backButtonText}>back</Text>
                </PressableScale>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '85%' }]} />
                </View>
                <FadeIn>
                    <Text style={styles.stepEyebrow}>Step three</Text>
                    <Text style={styles.notificationHeading}>This is the whole app.</Text>
                    <Text style={styles.notificationSubheading}>Your bytes arrive as notifications.{"\n"}You never have to open anything.</Text>
                </FadeIn>

                <FadeIn delay={110} style={styles.notificationStage}>
                    <View style={styles.notificationBanner}>
                        <Image
                            source={notificationShot}
                            style={styles.notificationBannerImage}
                            resizeMode="cover"
                        />
                    </View>
                </FadeIn>

                <FadeIn delay={200} style={styles.notificationFooter}>
                    <Daisy
                        source={daisy.peek}
                        height={100}
                        style={styles.notificationPeek}
                        pointerEvents="none"
                    />
                    <Text style={styles.notificationCaption}>You choose how many bytes{"\n"} a day, and when they arrive.{"\n"}Nothing else, ever.</Text>
                    <View style={styles.notificationFooterSpacer} />
                </FadeIn>
            </View>
            <View style={styles.actions}>
                <PressableScale
                    onPress={registerForPush}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Turn on notifications</Text>
                </PressableScale>
                <PressableScale
                    onPress={onSignUpPress}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.secondaryButtonPressed,
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>Continue</Text>
                </PressableScale>
                <PressableScale
                    onPress={onSignInPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Already have an account? Sign in</Text>
                </PressableScale>
            </View>
        </KeyboardAvoidingView>
    )
}