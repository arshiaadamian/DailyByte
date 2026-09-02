import { useState } from 'react';
import { Text } from 'react-native';

// import onbaording screens
import WelcomeScreen from './Welcome';
import TopicScreen from './Topic';
import ScheduleScreen from './Schedule';
import NotificationScreen from './Notification';
import SignUpScreen from './SignUp';


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
                    onBack={() => setScreen('topic')}
                />
                {console.log("Delivery time is: ", deliveryTime)}
                {console.log("after get hours: " , (deliveryTime.delivery1 ? deliveryTime.delivery1.getHours() : "getHours is null"))}
                {console.log("after get minutes: " , (deliveryTime.delivery1 ? deliveryTime.delivery1.getMinutes() : "getMinutes is null"))}
                {console.log("user's timezone is: ", timeZone)}
                {console.log("topics is(from parent): " + selectedTopic)}
            </>
        )
    }
    else if(screen === 'notification')
    {
        return (
            <NotificationScreen 
                onSignInPress={onSignInPress} onSignUpPress={() => setScreen('signUp')} 
                onBack={() => setScreen('schedule')}
            />
        );
    }
    // this else statement will render the signUp page
    else
    {
        return (
            <SignUpScreen 
                onSignInPress={onSignInPress}
                selectedTopic={selectedTopic}
                bytesPerDay={bytesPerDay}
                deliveryTime={deliveryTime}
                timeZone={timeZone}
                onBack={() => setScreen('notification')}

            />
        );
    }
    
}