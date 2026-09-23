import { useState } from 'react';

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

    if (screen === 'welcome')
    {
        return (
            <WelcomeScreen onSignInPress={onSignInPress} onGetStarted={() => setScreen('signUp')} />
        );
    }

    // this else statement will render the signUp page
    return (
        <SignUpScreen onSignInPress={onSignInPress} onBack={() => setScreen('welcome')} />
    );
}
