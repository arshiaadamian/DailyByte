import { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import styles from '../style/SignIn.styles';
import { Daisy } from '../components/Mascot';
import { FadeIn, PressableScale } from '../components/Motion';
import { daisy } from '../assets/mascots';


export default function SignInScreen({ onSignUpPress, onResetPress }) {

    const { signIn, getIdToken } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSignIn()
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
            await signIn(email.trim(), password);
            // const token = await getIdToken();
            // console.log("token is: ", token);
        }
        catch (err)
        {
            setError(err.message ?? "Could not sign in");
            setSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <FadeIn>
                    <Daisy source={daisy.tilted} height={132} style={styles.brandMark} />
                    <Text style={styles.heading}>DailyByte</Text>
                    <Text style={styles.subheading}>One small idea a day.</Text>
                </FadeIn>

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
                    textContentType="password"
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

                {error && <Text style={styles.error}>{error}</Text>}

                <PressableScale
                onPress={handleSignIn}
                disabled={submitting}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitting && styles.buttonDisabled,
                ]}
                >
                {submitting
                    ? <ActivityIndicator color="#E1DED3" />
                    : <Text style={styles.buttonText}>Sign in</Text>}
                </PressableScale>
                <PressableScale
                    onPress={onSignUpPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Don't have an account? Sign up</Text>
                </PressableScale>

                
                <PressableScale
                    onPress={onResetPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Reset Password</Text>
                </PressableScale>


            </View>
        </KeyboardAvoidingView>
    );
    
}