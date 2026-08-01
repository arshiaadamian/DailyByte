import {View} from 'react-native';
import ByteCard from '../components/ByteCard'
import data from '../data/todaysByte'

// Styles
import styles from '../style/Home.styles';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <ByteCard data={data}/>
        </View>
    );
}