import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignInScreen from './screens/SignIn';

// import screens
import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';
import SettingsScreen from './screens/Settings';

// import NavBar
import NavBar from "./components/NavBar";


SplashScreen.preventAutoHideAsync();

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
  const { status } = useAuth();
  // isActive state, the state that is passed down to the navbar, gets updated from there and gets passed back up.
  const [activeTab, setActiveTab] = useState("home");

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
    return <SignInScreen />;
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
  root: { flex: 1},
});
