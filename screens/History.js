import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import styles from '../style/History.styles';
import { fetchHistory } from '../api/bytes';
import { useEffect, useState } from 'react';
import ByteCard from '../components/ByteCard';
import { useAuth } from '../context/AuthContext';

export default function HistoryScreen(){

    // states
    const [bytes, setBytes] = useState([]);
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
                // console.log('token is: ',token);
                const data = await fetchHistory(token);

                if(cancelled === false)
                {
                    setBytes(data);
                }
            }
            catch (err)
            {
                if (cancelled === false)
                {
                    setError(err.message);
                }
            }
            finally 
            {
                if (cancelled === false)
                {
                    setLoading(false);
                }
            }
        }

        load();

        return (() => {cancelled = true});

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

    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Your past bytes</Text>
            <FlatList
                data={bytes}
                key={(item) => item.id}
                keyExtractor={(item) => item.date}
                renderItem={({item}) => <ByteCard data={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.message}>No past bytes yet.</Text>
                }
            />
        </View>
    )
}
