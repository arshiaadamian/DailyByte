import { View, Text, Pressable, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import styles from '../../style/Onboarding.styles';
import DailyByteLogo from '../../assets/logos/dailybyte-icon-light-1024.svg';


export default function WelcomeScreen({ onSignInPress , onGoToTopic})
{
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.hero}>
                <DailyByteLogo width={140} height={140} style={styles.logo} />
                <Text style={styles.heading}>
                   One thing a day.
                </Text>
                <Text style={styles.subheading}>
                    Pick a topic. Every morning we {"\n"}send one thing worth knowing.{"\n"}No feed. No catching up.
                </Text>
            </View>
            <View style={styles.actions}>
                <Pressable
                    onPress={onGoToTopic}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Get Started</Text>
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