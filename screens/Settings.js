import {View, Text, Pressable} from 'react-native';
import styles from '../style/Settings.styles';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function SettingsScreen()
{

    const { signOut, user } = useAuth();

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSignOut()
    {
        try
        {
            setSubmitting(true);
            setError(null);
            await signOut();
        }
        catch (err)
        {
            setSubmitting(false);
            setError(err.message ?? 'Could not sign out');
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Signed in as</Text>
                <Text style={styles.value}>{user?.signInDetails?.loginId ?? '-'}</Text>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
                onPress={handleSignOut}
                disabled={submitting}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitting && styles.buttonDisabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    {submitting ? 'Signing out…' : 'Sign out'}
                </Text>
            </Pressable>
        </View>
    )
}