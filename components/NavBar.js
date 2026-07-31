import { useState } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../style/NavBar.styles";

const ACTIVE_COLOR = "#816148";
const INACTIVE_COLOR = "#C6BDAB";

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
        key: "person",
        icon: "person"
    }
]


export default function NavBar()
{
    const [activeTab, setActiveTab] = useState("home");

    return (
        <View style={styles.navbar}>
            {TABS.map((tab) => {
                
                const tabKey = tab.key;
                const isActive = tabKey === activeTab;

                return (
                    <Pressable
                        key={tabKey}
                        style={styles.iconButton}
                        onPress={() => setActiveTab(tabKey)}
                    >
                        <Ionicons 
                            name={tabKey}
                            size={24}
                            color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}