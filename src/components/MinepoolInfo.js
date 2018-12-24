import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icons } from '../components/Icons';
import { WhiteSpace, Flex } from 'antd-mobile-rn';
import { formatCoin } from "../interfaces/utils";
import adapt from "../interfaces/adapt";
import I18n from "../interfaces/i18n";
export const MinepoolInfo = (props) => {
    const { earnStats, workStats, account, onToast } = props;
    return (React.createElement(View, { style: styles.header },
        React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
            React.createElement(Text, { style: styles.statusTitle },
                workStats.shares_15m,
                " ",
                workStats.shares_unit ? workStats.shares_unit : 'G',
                "H/s"),
            React.createElement(Text, { style: styles.title },
                I18n.t('share_24H'),
                " ",
                earnStats.shares_1d.size,
                " ",
                earnStats.shares_1d.unit,
                "H/s"),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.statusTitle },
                formatCoin(earnStats.unpaid),
                " ",
                account.coin_type),
            React.createElement(TouchableOpacity, { onPress: () => {
                    onToast(I18n.t('clock_balance_tips'));
                } },
                React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                    React.createElement(Text, { style: styles.title }, I18n.t('balance')),
                    React.createElement(Icons, { iconName: "icon_header_Detail", width: "10", height: "10" }))),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.statusTitle },
                earnStats.hashrate_yesterday.size,
                " ",
                earnStats.hashrate_yesterday.unit,
                "H/s"),
            React.createElement(Text, { style: styles.title }, I18n.t('hash_of_yesterday'))),
        React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
            React.createElement(Text, { style: styles.statusTitle },
                workStats.workers_total,
                " ",
                I18n.t('miner')),
            React.createElement(Text, { style: styles.title },
                I18n.t('active'),
                ":",
                workStats.workers_active,
                " ",
                I18n.t('inactive'),
                ":",
                workStats.workers_inactive),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.statusTitle },
                formatCoin(earnStats.earnings_today),
                " ",
                account.coin_type),
            React.createElement(TouchableOpacity, { onPress: () => {
                    onToast(I18n.t('clock_today_tips'));
                } },
                React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                    React.createElement(Text, { style: styles.title }, I18n.t('earn_today')),
                    React.createElement(Icons, { iconName: "icon_header_Detail", width: "10", height: "10" }))),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.statusTitle },
                formatCoin(earnStats.earnings_yesterday),
                " ",
                account.coin_type),
            React.createElement(TouchableOpacity, { onPress: () => {
                    onToast(I18n.t('clock_yestoday_tips'));
                } },
                React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                    React.createElement(Text, { style: styles.title }, I18n.t('earn_yestoday')),
                    React.createElement(Icons, { iconName: "icon_header_Detail", width: "10", height: "10" }))))));
};
const styles = StyleSheet.create({
    header: {
        // flex: 1,
        paddingTop: adapt.pxToDp(5),
        paddingBottom: adapt.pxToDp(25),
        backgroundColor: '#22A7F0',
        width: '100%',
        flexDirection: 'row'
    },
    statusTitle: {
        fontSize: adapt.setSpText(16),
        color: '#ffffff',
        marginBottom: adapt.pxToDp(4),
    },
    title: {
        fontSize: adapt.setSpText(12),
        color: '#ffffff',
        opacity: 0.7,
        marginRight: adapt.pxToDp(5)
    },
    minepool_item: {
        width: '50%',
    },
    values: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
    },
    subfont: {
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 12,
    }
});
//# sourceMappingURL=MinepoolInfo.js.map