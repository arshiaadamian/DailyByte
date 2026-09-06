import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../../style/Onboarding.styles';
import { Daisy } from '../../components/Mascot';
import { FadeIn, PressableScale } from '../../components/Motion';
import { daisy } from '../../assets/mascots';


export default function WelcomeScreen({ onSignInPress , onGoToTopic})
{
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.hero}>
                <FadeIn>
                    <Daisy
                        source={daisy.hero}
                        height={276}
                        style={styles.heroArt}
                    />
                </FadeIn>
                <FadeIn delay={110}>
                    <Text style={styles.heading}>
                       One thing a day.
                    </Text>
                    <Text style={styles.subheading}>
                        Pick a topic. Every morning we {"\n"}send one thing worth knowing.{"\n"}No feed. No catching up.
                    </Text>
                </FadeIn>
            </View>
            <FadeIn delay={220} style={styles.actions}>
                <PressableScale
                    onPress={onGoToTopic}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Get Started</Text>
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
            </FadeIn>
        </KeyboardAvoidingView>
    )
}
