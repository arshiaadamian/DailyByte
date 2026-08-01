import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';

// import screens
import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';
import SettingsScreen from './screens/Settings';

// import NavBar
import NavBar from "./components/NavBar";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({ Newsreader_400Regular, Newsreader_700Bold });

  // isActive state, the state that is passed down to the navbar, gets updated from there and gets passed back up.
  const [activeTab, setActiveTab] = useState("home");

  const screen = {
    "home": <HomeScreen />,
    "history": <HistoryScreen />,
    "settings": <SettingsScreen />
  }

  const activeScreen = screen[activeTab]

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="auto"/>
      {activeScreen}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1},
});
