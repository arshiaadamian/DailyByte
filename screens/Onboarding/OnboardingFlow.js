import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";

// import onbaording screens
import WelcomeScreen from './Welcome';
import SignUpScreen from './SignUp';

// this flow is pre-auth only now - welcome, then create an account.
// The preference steps moved to PreferencesFlow, which runs *after* sign in,
// once App.js has confirmed the user has no profile row yet. Before, the same
// component served both the signed-out and the signed-in-without-profile case,
// so a Google user was sent back through a sign-up screen they'd already passed.
export default function OnboardingFlow({ onSignInPress })
{
    const [screen, setScreen] = useState('welcome');
    const [err, setError] = useState(null)
    const [creating, setCreating] = useState(false);

    const {signUpAsGuest} = useAuth();

    async function createGuestUser(){
        if (creating) return; 
        setCreating(true);
        setError(null);

        try {
            await signUpAsGuest();
        } catch (err) {
            console.log("guest sign-up failed: ", err.message);
            setError(err.message);
            setCreating(false);
        }
    }


    if (screen === 'welcome')
    {
        return (
            <WelcomeScreen onSignInPress={onSignInPress} onGetStarted={() => createGuestUser()} signUp={() => setScreen('signUp')}/> 
        );
    }

    // this else statement will render the signUp page
    return (
        <SignUpScreen onSignInPress={onSignInPress} onBack={() => setScreen('welcome')} />
    );
}
