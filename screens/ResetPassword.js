import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles from '../style/SignIn.styles';
import { Ionicons } from '@expo/vector-icons';



export default function ResetPasswordScreen({onSignInPress})
{
    const { resetPassword, confirmResetPassword, getIdToken } = useAuth();

    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmationCode, setShowConfirmationCode] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successResetMessage, setSuccessResetMessage] = useState('');
    const [codeSentMessage, setCodeSentMessage] = useState('');

     async function handleResetPassword()
    {
        if (!email || !email.trim())
        {
            setError("Please enter your email address in order to reset your password");
            return;
        }

        try
        {
            setSubmitting(true);
            setError(null);
            await resetPassword(email);
            setSubmitting(false);
            setCodeSentMessage('Code has been sent to your email');
        }
        catch (err)
        {
            setError(err.message ?? "could not reach reset password" );
            setSubmitting(false)
        }   
    }

    async function handleConfirmResetPassword()
    {
        if (!email || !email.trim())
        {
            setError("Please enter your email address in order to reset your password");
            return;
        }

        if (!confirmationCode || !confirmationCode.trim())
        {
            setError("Please enter the confirmation code sent to your email");
            return;
        }

        if (!newPassword || !newPassword.trim())
        {
            setError("Please enter your new password");
            return;
        }

        if (newPassword.trim().length < 6)
        {
            setError("Password not long enough, it has to be at least 6 characters long");
            return;
        }

        try 
        {
            setSubmitting(true);
            setError(null);
            await confirmResetPassword(email, confirmationCode, newPassword);
            setSubmitting(false);
            setSuccessResetMessage("Your password has successfully been reseted");
        }
        catch (err)
        {
            setError(err.message ?? "Error reseting your password, make sure the confirmation code is correct");
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
                <Text style={styles.subheading}>Reset Password</Text>

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

                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordRow}>
                    <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={newPassword}
                    onChangeText={setNewPassword}
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

                <Pressable
                onPress={handleResetPassword}
                disabled={submitting}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitting && styles.buttonDisabled,
                ]}
                >
                {submitting
                    ? <ActivityIndicator color="#E1DED3" />
                    : <Text style={styles.buttonText}>Get Password Reset Code</Text>}
                </Pressable>

                {codeSentMessage && <Text style={styles.success}>{codeSentMessage}</Text>}

                {/* field to enter confirmation code */}
                <Text style={styles.label}>Confirmation Code</Text>
                <View style={styles.passwordRow}>
                    <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    placeholder="••••••••"
                    placeholderTextColor="#A39C8A"
                    secureTextEntry={!showConfirmationCode}
                    autoCapitalize="none"
                    textContentType="password"
                    />
                    <Pressable
                        onPress={() => setShowConfirmationCode((v) => !v)}
                        style={styles.eyeButton}
                        hitSlop={8}
                    >
                        <Ionicons
                            name={showConfirmationCode ? 'eye-off' : 'eye'}
                            size={20}
                            color="#5A5546"
                        />
                    </Pressable>
                </View>


                <Pressable
                onPress={handleConfirmResetPassword}
                disabled={submitting}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitting && styles.buttonDisabled,
                ]}
                >
                {submitting
                    ? <ActivityIndicator color="#E1DED3" />
                    : <Text style={styles.buttonText}>Reset Password</Text>}
                </Pressable>

                 {error && <Text style={styles.error}>{error}</Text>}
                 {successResetMessage && <Text style={styles.success}>{successResetMessage}</Text>}

                <Pressable
                    onPress={onSignInPress}
                    style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.resendButtonPressed,
                    ]}
                >
                    <Text style={styles.resendButtonText}>Back to Sign in</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );

}