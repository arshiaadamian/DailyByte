import {View, Text, FlatList} from 'react-native';
import styles from '../style/History.styles';
import { fetchHistory } from '../api/bytes';
import { useEffect, useState } from 'react';
import ByteCard from '../components/ByteCard';
import { Daisy, MascotMessage } from '../components/Mascot';
import { FadeIn, Pulse } from '../components/Motion';
import { daisy } from '../assets/mascots';
import { useAuth } from '../context/AuthContext';


// `pose` is optional - the error and empty states show their own large Daisy,
// so the masthead drops hers to avoid two on one screen.
function Masthead({ pose }) {
    return (
        <FadeIn style={styles.masthead}>
            <View>
                <Text style={styles.eyebrow}>Archive</Text>
                <Text style={styles.mastheadTitle}>Past bytes</Text>
            </View>
            {pose ? <Daisy source={pose} height={96} /> : null}
        </FadeIn>
    );
}


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
                <Masthead pose={daisy.books} />
                <View style={styles.listContent}>
                    <Pulse>
                        <View style={styles.skeletonCard} />
                        <View style={[styles.skeletonCard, { opacity: 0.7 }]} />
                        <View style={[styles.skeletonCard, { opacity: 0.4 }]} />
                    </Pulse>
                </View>
            </View>
        );
    }

    if (error)
    {
        return (
            <View style={styles.container}>
                <Masthead />
                <View style={styles.centered}>
                    <MascotMessage
                        source={daisy.peek}
                        title="Couldn't load your archive."
                        caption={error}
                        height={210}
                        delay={90}
                    />
                </View>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <Masthead pose={bytes.length ? daisy.books : null} />
            <FlatList
                data={bytes}
                key={(item) => item.id}
                keyExtractor={(item) => item.date}
                renderItem={({item, index}) => (
                    <FadeIn delay={Math.min(index, 6) * 70}>
                        <ByteCard data={item} />
                    </FadeIn>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MascotMessage
                            source={daisy.tilted}
                            title="No past bytes yet."
                            caption="Once your first few arrive, they'll collect here."
                            height={200}
                            delay={90}
                        />
                    </View>
                }
            />
        </View>
    )
}
