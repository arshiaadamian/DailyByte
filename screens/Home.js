// useEffect, useState
import {useEffect, useState} from 'react';

// Components
import {View, ScrollView, Text} from 'react-native';
import ByteCard from '../components/ByteCard'
import { Daisy, DaisyPerch, MascotMessage } from '../components/Mascot';
import { FadeIn, Pulse } from '../components/Motion';
import { daisy } from '../assets/mascots';

// Styles
import styles from '../style/Home.styles';

// fetch data
import { fetchTodaysByte } from '../api/bytes';

// context
import { useAuth } from '../context/AuthContext';


// Shared masthead so every state of this screen keeps the same anchor.
// `pose` is optional - states that already show a large Daisy leave it off, so
// she never appears twice on one screen.
function Masthead({ pose }) {
    return (
        <FadeIn style={styles.masthead}>
            <View>
                <Text style={styles.eyebrow}>Today</Text>
                <Text style={styles.mastheadTitle}>Your byte</Text>
            </View>
            {pose ? <Daisy source={pose} height={96} /> : null}
        </FadeIn>
    );
}

// Holds whichever card is showing. Daisy is deliberately outside the FadeIn:
// the loading and loaded branches are separate trees, so anything inside the
// fade would replay its entrance on the swap and read as a flicker. Keeping
// her out here means she is in the same pose, at the same size, in the same
// spot before and after - only the card underneath her changes.
function ByteSurface({ children }) {
    return (
        <View style={styles.byteSurface}>
            <DaisyPerch source={daisy.newspaper} height={88} overlap={14} />
            <FadeIn delay={80}>{children}</FadeIn>
        </View>
    );
}

// Paper-coloured stand-in with the same shape as a real byte card.
function CardSkeleton() {
    return (
            <View style={styles.skeleton}>
                <Pulse>
                    <View style={[styles.skeletonBar, styles.skeletonChip]} />
                    <View style={[styles.skeletonBar, { width: '82%', height: 22 }]} />
                    <View style={[styles.skeletonBar, { width: '64%', height: 22 }]} />
                    <View style={[styles.skeletonBar, { width: '100%', marginTop: 18 }]} />
                    <View style={[styles.skeletonBar, { width: '94%' }]} />
                    <View style={[styles.skeletonBar, { width: '88%' }]} />
                    <View style={[styles.skeletonBar, { width: '46%' }]} />
                </Pulse>
            </View>
    );
}


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
            <View style={styles.screen}>
                <Masthead />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <ByteSurface>
                        <CardSkeleton />
                    </ByteSurface>
                </ScrollView>
            </View>
        );
    }

    if (!byte)
    {
        return (
            <View style={styles.screen}>
                <Masthead />
                <View style={styles.centered}>
                    <MascotMessage
                        source={daisy.sleeping}
                        title="Your first byte is on its way."
                        caption="Daisy is resting until it lands. Nothing for you to do."
                        height={168}
                        delay={90}
                    />
                </View>
            </View>
        );
    }

    if (error)
    {
        return (
            <View style={styles.screen}>
                <Masthead />
                <View style={styles.centered}>
                    <MascotMessage
                        source={daisy.peek}
                        title="That didn't go through."
                        caption={error}
                        height={210}
                        delay={90}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <Masthead />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ByteSurface>
                    <ByteCard data={byte} />
                </ByteSurface>
            </ScrollView>
        </View>
    );
}
