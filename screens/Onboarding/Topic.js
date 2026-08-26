import { View, Text, Pressable, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import styles from '../../style/Welcome.styles';
import DailyByteLogo from '../../assets/logos/dailybyte-icon-light-1024.svg';


export default function TopicScreen({ })
{
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text>Topic page</Text>
            </View>
        </KeyboardAvoidingView>
    )
}