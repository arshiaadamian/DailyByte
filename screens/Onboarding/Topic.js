import { View, Text, Pressable, KeyboardAvoidingView, TextInput, Platform, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import styles from '../../style/Onboarding.styles';



export default function TopicScreen({ onSignInPress, setSelectedTopic, selectedTopic, onGoToSchedule})
{
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

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.scheduleTop}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '35%' }]} />
                </View>
                <Text style={styles.scheduleHeading}>What do you want to know more about?</Text>
                <Text style={styles.sectionLabel}>Select one topic and learn it deeper every day.</Text>
                <Text style={styles.sectionLabel}>You can change this any time.</Text>
                <FlatList
                    data={topics}
                    keyExtractor={item => item.value}
                    numColumns={2}
                    columnWrapperStyle={styles.topicRow}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => setSelectedTopic(item.value)}
                            style={[
                                styles.topicPill,
                                selectedTopic === item.value && styles.topicPillSelected,
                            ]}
                        >
                            <Text style={[
                                styles.topicPillText,
                                selectedTopic === item.value && styles.topicPillTextSelected,
                            ]}>{item.label}</Text>
                        </Pressable>
                    )}
                 />
            </View>
            <View style={styles.actions}>
                <Pressable
                    disabled={ selectedTopic.trim() ? false : true}
                    onPress={onGoToSchedule}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        !selectedTopic?.trim() && styles.primaryButtonDisabled,
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