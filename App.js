import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignInScreen from './screens/SignIn';
import ResetPasswordScreen from './screens/ResetPassword';

// import screens
import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';
import SettingsScreen from './screens/Settings';

// import onboarding screens
import OnboardingFlow from './screens/Onboarding/OnboardingFlow';
// import WelcomeScreen from './screens/Onboarding/Welcome';
// import TopicScreen from './screens/Onboarding/Topic'


// import NavBar
import NavBar from "./components/NavBar";

// import notifications
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { savePushToken } from './api/bytes';




SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({ Newsreader_400Regular, Newsreader_700Bold });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // these components come from another file
    // the two nested elements inside are the children which have access to the values of AuthProvider
    <AuthProvider>
      <StatusBar style='dark' /> 
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { status, getIdToken } = useAuth();
  // isActive state, the state that is passed down to the navbar, gets updated from there and gets passed back up.
  const [activeTab, setActiveTab] = useState("home");
  const [authScreen, setAuthScreen] = useState("signUp");

  // reset back to the sign-in screen so a later sign-out doesn't land on sign-up
  useEffect(() => {
    if (status === 'signedIn')
    {
      setAuthScreen('signIn');
    }
  }, [status]);

  // get userId token and pushToken and call API to write pushToken to DynamoDB
  async function handlePushToken()
    {
      const idToken = await getIdToken();

      const currentNotificationState = await Notifications.getPermissionsAsync();
      let status = currentNotificationState.status;
      // console.log("currentNotification is: ", status);

      let tokenData = '';

      if (status === 'granted')
      {
        try
        {
          const projectId = Constants.expoConfig.extra.eas.projectId;
          const token = await Notifications.getExpoPushTokenAsync({ projectId });
          tokenData = token.data;
          console.log("new pushToken is: ", tokenData);

          // call the savePushToken API
          try 
          {
            const response = await savePushToken(idToken, tokenData);
            console.log("SavePushToken: ", response.message);
          }
          catch (err)
          {
            console.log("SavePushToken error: ", err.message);
          }
        }
        catch (err)
        {
          console.log("Error with getting the getExpoPushTokenAsync function: ", err.message);
        }
      }
    }

  // on launch, if singed in, write pushToken to database
  useEffect(() => {
    if (status === 'signedIn')
    {
      handlePushToken();
    }
  }, [status]);

  const screen = {
    "home": <HomeScreen />,
    "history": <HistoryScreen />,
    "settings": <SettingsScreen />
  };

  if (status === 'checking')
  {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#816148" />
      </View>
    );
  }

  if (status === 'signedOut')
  {
    if (authScreen === 'signUp')
    {
      return <OnboardingFlow onSignInPress={() => setAuthScreen('signIn')} />;
      // return <WelcomeScreen onSignInPress={() => setAuthScreen('signIn')} onGoToTopic={() => setAuthScreen('topic')}/>
      // return <SignUpScreen onBackToSignIn={() => setAuthScreen('signIn')} />;
    }
    else if (authScreen === 'resetPassword')
    {
      return <ResetPasswordScreen onSignInPress={() => setAuthScreen('signIn')} />;
    }
    // this else statement renders the Sign in screen.
    else
    {
      return <SignInScreen onSignUpPress={() => setAuthScreen('signUp')} onResetPress={() => setAuthScreen('resetPassword')} />;
    }
  }

  const activeScreen = screen[activeTab]

  return (
    <View style={styles.root}>
      {activeScreen}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1DED3',
  },
});
