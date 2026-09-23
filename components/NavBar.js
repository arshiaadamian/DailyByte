import { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './Motion';
import styles from '../style/NavBar.styles';
import { colors } from '../style/theme';

const ACTIVE_COLOR = colors.onBrand;
const INACTIVE_COLOR = colors.inkFaint;

const TABS =
[
    {
        key: "settings",
        icon: "settings"
    },
    {
        key: "home",
        icon: "home"
    },
    {
        key: "history",
        icon: "time"
    }
]


export default function NavBar({activeTab, setActiveTab})
{
    // Width of the tab row, measured once, so the indicator can be positioned
    // in real pixels rather than percentages (percentages can't be animated
    // on the native driver).
    const [rowWidth, setRowWidth] = useState(0);
    const position = useRef(new Animated.Value(0)).current;

    const activeIndex = Math.max(TABS.findIndex((tab) => tab.key === activeTab), 0);
    const slotWidth = rowWidth / TABS.length;

    useEffect(() => {
        Animated.spring(position, {
            toValue: activeIndex,
            useNativeDriver: true,
            speed: 14,
            bounciness: 7,
        }).start();
    }, [activeIndex]);

    const translateX = position.interpolate({
        inputRange: [0, TABS.length - 1],
        outputRange: [0, slotWidth * (TABS.length - 1)],
    });

    return (
        <View style={styles.wrap} pointerEvents="box-none">
            <View style={styles.bar}>
                <View
                    style={styles.row}
                    onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}
                >
                    {rowWidth > 0 && (
                        <Animated.View
                            style={[styles.indicatorSlot, { width: slotWidth, transform: [{ translateX }] }]}
                            pointerEvents="none"
                        >
                            <View style={styles.indicator} />
                        </Animated.View>
                    )}

                    {TABS.map((tab) => {
                        const tabKey = tab.key;
                        const isActive = tabKey === activeTab;

                        return (
                            <PressableScale
                                key={tabKey}
                                style={styles.iconButton}
                                scaleTo={0.88}
                                onPress={() => setActiveTab(tabKey)}
                            >
                                <Ionicons
                                    name={isActive? tab.icon : `${tab.icon}-outline`}
                                    size={22}
                                    color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                                />
                            </PressableScale>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
