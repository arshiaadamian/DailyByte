import { useState } from 'react';
import { Text } from 'react-native';

// import onbaording screens
import WelcomeScreen from './Welcome';
import TopicScreen from './Topic';
import ScheduleScreen from './Schedule';


export default function OnboardingFlow({ onSignInPress })
{
    const [screen, setScreen] = useState('welcome');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [bytesPerDay, setBytesPerDay] = useState(1);
    const [deliveryTime, setDeliveryTime] = useState({
        delivery1: null,
        delivery2: null,
        delivery3: null
    });
    const [timeZone, setTimeZone] = useState('');

    if (screen === 'welcome')
    {
        return (
            <WelcomeScreen onSignInPress={onSignInPress} onGoToTopic={() => setScreen('topic')}/>
        );
    }
    else if (screen === 'topic')
    {
        return (
            <>
                <TopicScreen onSignInPress={onSignInPress} onGoToSchedule={() => setScreen('schedule')} setSelectedTopic={setSelectedTopic} selectedTopic={selectedTopic} />
                {console.log("topics is(from parent): " + selectedTopic)}
            </>
        );
    }
    else if (screen === 'schedule')
    {
        return (
            <>
                <ScheduleScreen onSignInPress={onSignInPress}
                    onGoToNotificationPress={() => setScreen('notification')}
                    setBytesPerDay={setBytesPerDay}
                    bytesPerDay={bytesPerDay}
                    setDeliveryTime={setDeliveryTime}
                    deliveryTime={deliveryTime}
                    setTimeZone={setTimeZone}
                />
                {console.log("Delivery time is: ", deliveryTime)}
                {console.log("user's timezone is: ", timeZone)}
            </>
        )
    }
    else
    {
        <Text>
            notification page sample
        </Text>
    }
    
}