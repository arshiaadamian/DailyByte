import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import styles from '../style/SignIn.styles';


export default function SignInScreen({ onSignUpPress }) {

    const { signIn } = useAuth();

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
                <Text style={styles.heading}>DailyByte</Text>
                <Text style={styles.subheading}>One small idea a day.</Text>

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

                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable
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
                </Pressable>
                <Pressable
                    onPress={onSignUpPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Don't have an account? Sign up</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
    
}