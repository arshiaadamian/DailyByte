import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import ByteCard from "./components/ByteCard";
import todaysData from "./data/todaysByte";

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
    // <SafeAreaView style={styles.root}>
    <View style={styles.root}>
      <ByteCard data={todaysData} />
      <StatusBar style="auto"/>
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1},
});
