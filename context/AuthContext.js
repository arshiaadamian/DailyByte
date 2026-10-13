import { createContext, useContext, useEffect, useState } from 'react';

// import the API to create a dummy cognito account
import { getCurrentUser, signIn as amplifySignIn,
     signOut as amplifySignOut, signUp as amplifySignUp,fetchAuthSession,
      confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendCode,
       autoSignIn as amplifyAutoSignIn, resetPassword as amplifyResetPassword,
        confirmResetPassword as amplifyConfirmResetPassword, signInWithRedirect,
         updateUserAttributes, confirmUserAttribute, sendUserAttributeVerificationCode, updatePassword} from 'aws-amplify/auth';

import { Hub } from 'aws-amplify/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null); // auth context variable, called an empty channel

const GUEST_EMAIL_DOMAIN = '@guest.dailybyte.com.invalid';
const GUEST_PASSWORD_KEY = 'guestPassword';

export function isGuestEmail(email)
{
    return email?.endsWith(GUEST_EMAIL_DOMAIN) ?? false;
}

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

    useEffect(() => {
        async function handleAuthEvent(data)
        {
            const event = data.payload.event; // amplify sends this, e.g. signInWithRedirect

            if (event === 'signInWithRedirect')
            {
                try 
                {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                    setStatus('signedIn');
                }
                catch (err)
                {
                    console.log("Post-redirect session load failed: ", err.message);
                    setStatus('signedOut');
                }
            }
            else if (event === 'signInWithRedirect_failure')
            {
                console.log("OAuth failed: ", data.payload.data);
                setStatus('signedOut');
            }
        }

        // CHANGED: these two lines used to sit inside handleAuthEvent, so nothing
        // ever subscribed - the handler could only run if it was already running.
        // Google sign in only appeared to work because the next app launch picked
        // the persisted session up through getCurrentUser above.
        const unsubscribe = Hub.listen('auth', handleAuthEvent);
        return unsubscribe;
    }, [])

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

    function randomFrom(chars, count)
    {
        const values = new Uint32Array(count);
        crypto.getRandomValues(values);
        let result = '';
        for (let i = 0; i < count; i++)
        {
            result += chars[values[i] % chars.length];
        }
        return result;
    }

    function createRandomEmail(){
        const randomId = Date.now().toString(36) + Math.random().toString(36).slice(2)
        const email = `guestemail.${randomId}${GUEST_EMAIL_DOMAIN}`
        return email
    }

    function createRandomPassword(){
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const symbols = '!@#$%^&*';

        const randomLower = randomFrom(lower, 1)
        const randomUpper = randomFrom(upper, 1)
        const randomDigits = randomFrom(digits, 1)
        const randomSymbols = randomFrom(symbols, 1)
        const randomAll = randomFrom(lower + upper + digits + symbols, 21)

        const password = randomLower + randomUpper + randomDigits + randomSymbols + randomAll
        return password
         
    }

    // add lambda to auto confirm guest sign ups, and add it as a trigger to cognito.
    async function signUpAsGuest(){
        const randomEmail = createRandomEmail()
        const randomPassword = createRandomPassword()

        await amplifySignUp({
            username: randomEmail,
            password: randomPassword,
            options: {userAttributes: {email: randomEmail}}
        })
        await AsyncStorage.setItem(GUEST_PASSWORD_KEY, randomPassword)

        await amplifySignIn({
            username: randomEmail,
            password: randomPassword
        })
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setStatus("signedIn")
    }

    async function startGuestUpgrade(email)
    {
        await updateUserAttributes({ userAttributes: { email } });
    }

    async function resendGuestUpgradeCode()
    {
        await sendUserAttributeVerificationCode({ userAttributeKey: 'email' });
    }

    async function confirmGuestEmail(code)
    {
        await confirmUserAttribute({ userAttributeKey: 'email', confirmationCode: code });
    }

    async function setGuestPassword(newPassword)
    {
        const guestPassword = await AsyncStorage.getItem(GUEST_PASSWORD_KEY);
        if (!guestPassword)
        {
            throw new Error("Couldn't find this guest account's password on this device. Use 'Forgot password' on the sign in screen to set one.");
        }
        await updatePassword({ oldPassword: guestPassword, newPassword });
        await AsyncStorage.removeItem(GUEST_PASSWORD_KEY);
        await fetchAuthSession({ forceRefresh: true });
    }

    // CHANGED: clientMetadata dropped. The profile row is created by POST /user
    // after onboarding now, not by the PostConfirmation trigger.
    async function confirmSignUp(email, code)
    {
        await amplifyConfirmSignUp( {username: email, confirmationCode: code });
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

    async function getEmail()
    {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.payload?.email;
    }

    async function loginWithGoogle()
    {
        await signInWithRedirect({ provider: 'Google' });
    }

    async function loginWithApple()
    {
        await signInWithRedirect({ provider: 'Apple' });
    }

    return (
        <AuthContext.Provider value={{status, user, signIn, signOut, signUp, confirmSignUp, resendCode, getIdToken, resetPassword, confirmResetPassword, loginWithGoogle, loginWithApple, signUpAsGuest, getEmail, startGuestUpgrade, resendGuestUpgradeCode, confirmGuestEmail, setGuestPassword}} >
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

