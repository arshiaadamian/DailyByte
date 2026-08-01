import {View, Text} from 'react-native';
import styles from '../style/Settings.styles';

export default function SettingsScreen()
{
    return(
        <View style={styles.container}>
            <Text style={styles.message}>
                This is the settings screen
            </Text>
        </View>
    )
}