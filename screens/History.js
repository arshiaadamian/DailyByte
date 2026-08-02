import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import styles from '../style/History.styles';
import { fetchHistory } from '../api/bytes';
import { useEffect, useState } from 'react';
import ByteCard from '../components/ByteCard';

export default function HistoryScreen(){

    // states
    const [bytes, setBytes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load()
        {
            try
            {
                setLoading(true);
                setError(null);
                
                const data = await fetchHistory();

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
                keyExtractor={(item) => item.id}
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
