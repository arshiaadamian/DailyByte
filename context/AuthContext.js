import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut, signUp as amplifySignUp,fetchAuthSession, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendCode, autoSignIn as amplifyAutoSignIn, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword } from 'aws-amplify/auth';

const AuthContext = createContext(null); // auth context variable, called an empty channel

// children is the component from the parent 
export function AuthProvider({ children }) // children is a special prop, it is whatever JSX you nest inside the tags in App.js (parent)
{
    const [status, setStatus] = useState('checking');
    const [user, setUser] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function checkSession() {
            try {
                const currentUser = await getCurrentUser();
                if (!cancelled)
                {
                    setUser(currentUser);
                    setStatus('signedIn');
                }
            }
            catch
            {
                if (!cancelled)
                {
                    setUser(null);
                    setStatus('signedOut');
                }
            }
        }

        checkSession();
        return (
            () => {
                cancelled = true;
            }
        )
    }, []);

    async function signIn(email, password)
    {
        await amplifySignIn({username: email, password});
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus('signedIn');
    }

    async function signOut()
    {
        await amplifySignOut();
        setUser(null);
        setStatus('signedOut');
    }

    async function signUp(email, password)
    {
        await amplifySignUp({
             username: email,
             password,
             options: { userAttributes: {email}, autoSignIn: true }
        });
    }

    async function confirmSignUp(email, code, clientMetadata)
    {
        await amplifyConfirmSignUp( {username: email, confirmationCode: code, options: {clientMetadata} });
        await amplifyAutoSignIn();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus('signedIn');
    }

    async function resendCode(email)
    {
        await amplifyResendCode( {username: email });
    }

    async function resetPassword(email)
    {
        await amplifyResetPassword({ username: email });
    }

    async function confirmResetPassword(email, confirmationCode, newPassword)
    {
        await amplifyConfirmResetPassword({ username: email, confirmationCode: confirmationCode, newPassword: newPassword});
    }

    async function getIdToken()
    {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    }

    return (
        <AuthContext.Provider value={{status, user, signIn, signOut, signUp, confirmSignUp, resendCode, getIdToken, resetPassword, confirmResetPassword}} >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() 
{
    const context = useContext(AuthContext);
    if (!context)
    {
        throw new Error('useAuth must be used inside an AuthProvider');
    }
    
    return context;
}

