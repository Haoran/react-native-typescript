import React from 'react';
import { StyleSheet, Text, } from 'react-native';
import { Flex } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import I18n from "../../interfaces/i18n";
export const WorkerTabs = (props, group) => {
    // console.log(props);
    const activeTab = props.activeTab;
    return (React.createElement(Flex, { direction: "row", justify: "center", align: "start", style: styles.tabs },
        React.createElement(Flex, { direction: "column", justify: "center", style: activeTab == 0 ? styles.activeBottom : styles.tab, onPress: () => props.goToTab(0) },
            React.createElement(Text, { style: [styles.tabTitle, activeTab == 0 ? styles.activeColor : null] },
                I18n.t("miner_top_view_active_item"),
                "(",
                group.length > 0 ? group[0].workers_active : 0,
                ")"),
            React.createElement(Text, { style: [styles.tabHash, activeTab == 0 ? styles.activeColor : null] },
                group.length > 0 ? group[0].shares_15m : 0,
                " ",
                group.length > 0 ? group[0].shares_unit : 'M',
                "H/s")),
        React.createElement(Flex, { justify: "center", align: "start", style: activeTab == 1 ? styles.activeBottom : styles.tab, onPress: () => props.goToTab(1) },
            React.createElement(Text, { style: [styles.tabTitle, activeTab == 1 ? styles.activeColor : null] },
                I18n.t("miner_top_view_inactive_item"),
                "(",
                group.length > 0 ? group[0].workers_inactive : 0,
                ")")),
        React.createElement(Flex, { justify: "center", align: "start", style: activeTab == 2 ? styles.activeBottom : styles.tab, onPress: () => props.goToTab(2) },
            React.createElement(Text, { style: [styles.tabTitle, activeTab == 2 ? styles.activeColor : null] },
                I18n.t("miner_top_view_dead_item"),
                "(",
                group.length > 0 ? group[0].workers_dead : 0,
                ")")),
        React.createElement(Flex, { direction: "column", justify: "center", style: activeTab == 3 ? styles.activeBottom : styles.tab, onPress: () => props.goToTab(3) },
            React.createElement(Text, { style: [styles.tabTitle, activeTab == 3 ? styles.activeColor : null] },
                I18n.t("miner_top_view_all_item"),
                "(",
                group.length > 0 ? group[0].workers_total : 0,
                ")"),
            React.createElement(Text, { style: [styles.tabHash, activeTab == 3 ? styles.activeColor : null] },
                group.length > 0 ? group[0].shares_15m : 0,
                " ",
                group.length > 0 ? group[0].shares_unit : 'M',
                "H/s"))));
};
const styles = StyleSheet.create({
    tabs: {
        height: adapt.pxToDp(55),
        borderTopWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.12)',
    },
    tabTitle: {
        fontSize: adapt.setSpText(14),
        color: "#999999",
    },
    tabHash: {
        fontSize: adapt.setSpText(14),
        color: "#999999",
        paddingTop: adapt.pxToDp(4)
    },
    tab: {
        flex: 1,
        height: '100%',
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        paddingTop: adapt.pxToDp(8),
        paddingBottom: adapt.pxToDp(8),
    },
    activeColor: {
        color: '#22A7F0'
    },
    activeBottom: {
        flex: 1,
        height: '100%',
        borderBottomWidth: 2,
        borderColor: '#22A7F0',
        paddingTop: adapt.pxToDp(8),
        paddingBottom: adapt.pxToDp(8),
    },
});
//# sourceMappingURL=WorkerTabs.js.map