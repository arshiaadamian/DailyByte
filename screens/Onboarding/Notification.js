import { View, Text, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import {useState} from 'react';
import styles from '../../style/Onboarding.styles';
import NotificationImage from '../../assets/notification-preview.svg';

export default function NotificationScreen({ onSignInPress, onSignUpPress })
{
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.notificationTop}>
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
                    onPress={onSignUpPress}
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