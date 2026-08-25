import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordScreen({onSignInPress})
{
    const { signIn, resetPassword, confirmResetPassword, getIdToken } = useAuth();

    const [email, setEmail] = useState('yo');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
        }
        catch (err)
        {
            setError("could not reach reset password; " + err.message);
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

        try 
        {
            setSubmitting(true);
            setError(null);
            await confirmResetPassword(email, confirmationCode, newPassword);
            setSubmitting(false);
        }
        catch (err)
        {
            setError("Error reseting your password, make sure the confirmation code is correct; " + err.message);
            setSubmitting(false);
        }
    }

    return (
        <View>
            <Text>{email}beeeefsff</Text>
        </View>
    );

}