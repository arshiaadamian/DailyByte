// useEffect, useState
import {useEffect, useState} from 'react';

// Components
import {View, ActivityIndicator, Text} from 'react-native';
import ByteCard from '../components/ByteCard'

// Styles
import styles from '../style/Home.styles';

// fetch data
import { fetchTodaysByte } from '../api/bytes';

// context
import { useAuth } from '../context/AuthContext';


export default function HomeScreen() {

    // states
    const [byte, setByte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getIdToken } = useAuth();


    useEffect(() => {
        let cancelled = false;

        async function load()
        {
            try
            {
                setLoading(true);
                setError(null);
                const token = await getIdToken();
                // console.log('token is: ', token);
                const data = await fetchTodaysByte(token);
                
                if(!cancelled)
                {
                    setByte(data);
                }
            }
            catch (err)
            {
                if (!cancelled)
                {
                    setError(err.message);
                }
            }
            finally 
            {
                if (!cancelled)
                {
                    setLoading(false);
                }
            }
        }

        load();
        return () => { cancelled = true }

    }, []);

    if (loading)
    {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#816148" />
            </View>
        );
    }

    if (error)
    {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ByteCard data={byte}/>
        </View>
    );
}