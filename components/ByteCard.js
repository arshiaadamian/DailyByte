import { Text, View, Pressable, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from '../style/App.styles';
import NavBar from "./NavBar";
import NavBarStyles from "../style/NavBar.styles"


export default function ByteCard( {data} ) {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.topic}>{data.topic}</Text>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.body}>{data.body}</Text>
                <Pressable onPress={() => Linking.openURL(data.sourceURL)} style={({ pressed }) => pressed && { opacity: 0.5 }}>
                    <Text style={styles.source}>Read more →</Text>
                </Pressable>
            </View>
            <View style={styles.NavBar}>
                <NavBar/>
            </View>
        </View>
    );
}