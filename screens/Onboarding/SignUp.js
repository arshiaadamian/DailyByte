import { View, Text, Pressable, KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import styles from '../../style/Onboarding.styles';

export default function SignUpScreen({ onSignInPress, selectedTopic, bytesPerDay, deliveryTime, timeZone })
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
        .filter(delivery => delivery !== null);

    const clientMetadata = {
        selectedTopic: selectedTopic,
        bytesPerDay: String(bytesPerDay), 
        deliveryTime: JSON.stringify(deliveryHours),
        timeZone: timeZone
    }

    async function handleSignUp()
    {
        if (!email.trim() || !password)
        {
            setError("Please enter your email and password");
            return;
        }

        try
        {
            setSubmitting(true);
            setError(null);
            if (password === confirmPassword)
            {
                await signUp(email.trim(), password);
                setSubmitting(false);
                setDisplayCodeInput(true);
            }
            else
            {
                setError("Passwords have to match.");
                setSubmitting(false);
                setDisplayCodeInput(false);
            }
            
        }
        catch (err)
        {
            setError(err.message ?? "Could not sign up");
            setSubmitting(false);
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
            await resendCode(email);
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
                        <Text style={styles.signUpHeading}>Sign up</Text>
                        <Text style={styles.signUpSubheading}>Create your DailyByte account.</Text>

                        <Text style={styles.label}>Email</Text>
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
                            <Pressable
                                onPress={() => setShowPassword((v) => !v)}
                                style={styles.eyeButton}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#5A5546"
                                />
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Confrim Password</Text>
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
                            <Pressable
                                onPress={() => setShowConfirmPassword((v) => !v)}
                                style={styles.eyeButton}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#5A5546"
                                />
                            </Pressable>
                        </View>

                        {error && <Text style={styles.error}>{error}</Text>}

                        <Pressable
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
                        </Pressable>

                        <Pressable
                            onPress={onSignInPress}
                            style={({ pressed }) => [
                                styles.resendButton,
                                pressed && styles.resendButtonPressed,
                            ]}
                        >
                            <Text style={styles.signUpLinkText}>Already have an account? Sign in</Text>
                        </Pressable>
                    </View>
                )}

                {displayCodeInput && (
                    <View>
                        <Text style={styles.signUpHeading}>Check your email</Text>
                        <Text style={styles.signUpSubheading}>Enter the confirmation code we sent you.</Text>

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

                        <Pressable
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
                        </Pressable>

                        <Pressable
                            onPress={handleResendCode}
                            disabled={submitting}
                            style={({ pressed }) => [
                                styles.resendButton,
                                pressed && styles.resendButtonPressed,
                            ]}
                        >
                            <Text style={styles.signUpLinkText}>Resend code</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}