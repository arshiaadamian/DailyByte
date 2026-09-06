import { View, Text, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import styles from '../../style/Onboarding.styles';
import { Daisy, DaisyPerch } from '../../components/Mascot';
import { FadeIn, PressableScale } from '../../components/Motion';
import { daisy } from '../../assets/mascots';

export default function SignUpScreen({ onSignInPress, selectedTopic, bytesPerDay, deliveryTime, timeZone, onBack, pushToken})
{
    const { signUp, confirmSignUp, resendCode } = useAuth();

    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [displayCodeInput, setDisplayCodeInput] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const deliveryHours = [deliveryTime.delivery1, deliveryTime.delivery2, deliveryTime.delivery3]
        .filter(delivery => delivery !== null)
        .map(delivery => ({ hour: delivery.getHours(),  minute: delivery.getMinutes()}));

    const clientMetadata = {
        selectedTopic: selectedTopic,
        bytesPerDay: String(bytesPerDay), 
        deliveryTime: JSON.stringify(deliveryHours),
        timeZone: timeZone,
        pushToken: pushToken
    }

    async function handleSignUp()
    {
        if (!email.trim() || !password)
        {
            setError("Please enter your email and password");
            return;
        }

        if (password !== confirmPassword)
        {
            setError("Passwords must match");
            setSubmitting(false);
            setDisplayCodeInput(false);
            return;
        }

        try
        {
            setError(null);

            await signUp(email.trim(), password);
            setSubmitting(false);
            setDisplayCodeInput(true);
        }
        catch (err)
        {
            if (err.name === 'UsernameExistsException')
            {
                try
                {
                    setSubmitting(false);
                    await resendCode(email.trim());
                    setDisplayCodeInput(true);
                    setError("A new code was sent, please check your email again");
                }
                catch (err)
                {
                    setError("That email is already registered. Try signing in instead. err: " + err);
                }
            }
            else
            {
                setError(err.message ?? "Could not sign up");
                setSubmitting(false);
            }
        }
    }
    
    async function handleConfirmationCode()
    {
        if (!code.trim() || !email.trim())
        {
            setError('Please enter the confirmation code');
            return;
        }
        try
        {
            setError(null);
            setSubmitting(true);
            await confirmSignUp(email, code, clientMetadata);
            setSubmitting(false);
        }
        catch (err)
        {
            setSubmitting(false);
            setError(err.message ?? 'Error with the confirmation code');
            return;
        }
    }

    async function handleResendCode()
    {
        if (!email.trim())
        {
            setError("Please enter an email address for the code to be sent to");
            return;
        }
        try
        {
            setError(null)
            setSubmitting(true);
            await resendCode(email.trim());
            setSubmitting(false);
        }
        catch (err)
        {
            setSubmitting(false);
            setError(err.message ?? 'Error sending a new code');
        }
    }
    return (
        <KeyboardAvoidingView
            style={styles.signUpScreen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '95%' }]} />
                </View>
                {!displayCodeInput && (
                    <View>
                        <PressableScale
                            onPress={onBack}
                            style={({ pressed }) => [
                                styles.backButton,
                                pressed && styles.backButtonPressed,
                            ]}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </PressableScale>

                        <FadeIn>
                            <Text style={styles.stepEyebrow}>Last step</Text>
                            <Text style={styles.signUpHeading}>Sign up</Text>
                            <Text style={styles.signUpSubheading}>Create your DailyByte account.</Text>
                        </FadeIn>

                        <Text style={styles.label}>Email</Text>
                        {/* Daisy sits directly above the field with a negative
                            bottom margin, so the input paints over her paws and
                            she reads as popping out of it. */}
                        <DaisyPerch
                            source={daisy.graduation}
                            height={98}
                            overlap={20}
                            style={styles.fieldMascot}
                        />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#A39C8A"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                        />

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#A39C8A"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                textContentType="newPassword"
                            />
                            <PressableScale
                                onPress={() => setShowPassword((v) => !v)}
                                style={styles.eyeButton}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#5A5546"
                                />
                            </PressableScale>
                        </View>

                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#A39C8A"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                textContentType="newPassword"
                            />
                            <PressableScale
                                onPress={() => setShowConfirmPassword((v) => !v)}
                                style={styles.eyeButton}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#5A5546"
                                />
                            </PressableScale>
                        </View>

                        {error && <Text style={styles.error}>{error}</Text>}

                        <PressableScale
                            onPress={handleSignUp}
                            disabled={submitting}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                                submitting && styles.buttonDisabled,
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {submitting ? 'Signing up…' : 'Sign up'}
                            </Text>
                        </PressableScale>

                        <PressableScale
                            onPress={onSignInPress}
                            style={({ pressed }) => [
                                styles.resendButton,
                                pressed && styles.resendButtonPressed,
                            ]}
                        >
                            <Text style={styles.signUpLinkText}>Already have an account? Sign in</Text>
                        </PressableScale>
                    </View>
                )}

                {displayCodeInput && (
                    <View>
                        <PressableScale
                            onPress={() => setDisplayCodeInput(false)}
                            style={({ pressed }) => [
                                styles.backButton,
                                pressed && styles.backButtonPressed,
                            ]}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </PressableScale>

                        <FadeIn style={styles.stepHeader}>
                            <View style={styles.stepHeaderText}>
                                <Text style={styles.signUpHeading}>Check your email</Text>
                                <Text style={styles.signUpSubheading}>Enter the confirmation code we sent you.</Text>
                            </View>
                            <Daisy source={daisy.peek} height={90} />
                        </FadeIn>

                        <Text style={styles.label}>Code</Text>
                        <TextInput
                            style={styles.input}
                            value={code}
                            onChangeText={setCode}
                            placeholder="123456"
                            placeholderTextColor="#A39C8A"
                            keyboardType="number-pad"
                        />

                        {error && <Text style={styles.error}>{error}</Text>}

                        <PressableScale
                            onPress={handleConfirmationCode}
                            disabled={submitting}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                                submitting && styles.buttonDisabled,
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {submitting ? 'Confirming…' : 'Confirm code'}
                            </Text>
                        </PressableScale>

                        <PressableScale
                            onPress={handleResendCode}
                            disabled={submitting}
                            style={({ pressed }) => [
                                styles.resendButton,
                                pressed && styles.resendButtonPressed,
                            ]}
                        >
                            <Text style={styles.signUpLinkText}>Resend code</Text>
                        </PressableScale>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}