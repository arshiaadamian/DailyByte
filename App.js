import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import HomeScreen from './screens/Home'
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


  // isActive state, the state that is passed down to the navbar, gets updated from there and gets passed back up.
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.root}>
      <StatusBar style="auto"/>
      <HomeScreen />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1},
});
