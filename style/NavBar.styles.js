import { StyleSheet, Platform } from "react-native";
import { colors, radius, shadow } from "./theme";

const styles = StyleSheet.create({
    // Floats over the active screen rather than taking a row in the layout.
    // Screens reserve room for it with theme's NAV_CLEARANCE.
    wrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 34 : 22,
        alignItems: 'center',
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: colors.paper,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 6,
        width: 232,
        ...shadow.lifted,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    // Slides behind the icons to mark the active tab.
    indicatorSlot: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: 46,
        height: 46,
        borderRadius: radius.pill,
        backgroundColor: colors.brand,
    },
    iconButton: {
        flex: 1,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default styles;
