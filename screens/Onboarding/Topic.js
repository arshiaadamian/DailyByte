import { View, Text, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import styles from '../../style/Onboarding.styles';
import { Daisy } from '../../components/Mascot';
import { FadeIn, PressableScale } from '../../components/Motion';
import { daisy } from '../../assets/mascots';



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

                <FadeIn style={styles.stepHeader}>
                    <View style={styles.stepHeaderText}>
                        <Text style={styles.stepEyebrow}>Step one</Text>
                        <Text style={styles.scheduleHeading}>What do you want to know more about?</Text>
                    </View>
                    <Daisy source={daisy.glasses} height={92} />
                </FadeIn>

                <FadeIn delay={90}>
                    <Text style={styles.stepCaption}>Select one topic and learn it deeper every day.</Text>
                    <Text style={styles.stepCaption}>You can change this any time.</Text>
                </FadeIn>

                <FlatList
                    data={topics}
                    keyExtractor={item => item.value}
                    numColumns={2}
                    columnWrapperStyle={styles.topicRow}
                    scrollEnabled={false}
                    style={styles.topicList}
                    renderItem={({ item, index }) => (
                        <FadeIn delay={140 + index * 40} offset={10} style={styles.topicCell}>
                            <PressableScale
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
                            </PressableScale>
                        </FadeIn>
                    )}
                 />
            </View>
            <View style={styles.actions}>
                <PressableScale
                    disabled={ selectedTopic.trim() ? false : true}
                    onPress={onGoToSchedule}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        !selectedTopic?.trim() && styles.primaryButtonDisabled,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                </PressableScale>
                <PressableScale
                    onPress={onSignInPress}
                    scaleTo={0.98}
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
