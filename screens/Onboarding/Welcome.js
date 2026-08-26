import { View, Text, Pressable, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import styles from '../../style/Welcome.styles';


export default function WelcomeScreen({ onSignInPress })
{
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
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