import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import adapt from "../interfaces/adapt";
import { formatBigNum } from "../interfaces/utils";
import moment from "moment";
import I18n from "../interfaces/i18n";
const lang = "zh-cn";
const floatNum = (v, n) => {
    return parseFloat(v).toFixed(n);
};
export const NetworkInfo = (props) => {
    const { networkStatus, coinType } = props;
    const re_coinType = coinType == 'BCH' ? "BCC" : coinType;
    const fpps_income = lang == "zh-cn" ? "￥" + floatNum(networkStatus.exchange_rate[re_coinType + "2CNY"] * networkStatus.fpps_mining_earnings, 2) :
        "$" + floatNum(networkStatus.exchange_rate[re_coinType + "2USD"] * networkStatus.fpps_mining_earnings, 2);
    const next_diff = networkStatus.difficulty_change ? networkStatus.difficulty_change + "(" + formatBigNum(networkStatus.estimated_next_difficulty) + ")" : "-";
    const times_remain = networkStatus.time_remain ? moment(moment.unix(networkStatus.time_remain)).fromNow() : "-";
    return (React.createElement(View, { style: styles.network },
        React.createElement(View, { style: styles.caption },
            React.createElement(Text, { style: styles.caption_text }, I18n.t('network_title'))),
        networkStatus.network_hashrate && networkStatus.network_hashrate != '-' ?
            React.createElement(View, { style: styles.item },
                React.createElement(Text, { style: styles.text }, I18n.t('network_hsahtate')),
                React.createElement(Text, { style: styles.value },
                    networkStatus.network_hashrate,
                    " ",
                    networkStatus.network_hashrate_unit,
                    "H/s")) : null,
        React.createElement(View, { style: styles.item },
            React.createElement(Text, { style: styles.text }, I18n.t('network_pool_hashrate')),
            React.createElement(Text, { style: styles.value },
                networkStatus.pool_hashrate,
                " ",
                networkStatus.pool_hashrate_unit,
                "H/s")),
        React.createElement(View, { style: styles.item },
            React.createElement(Text, { style: styles.text }, I18n.t('network_earn')),
            React.createElement(Text, { style: styles.value },
                "1",
                networkStatus.mining_earnings_unit,
                "*24H = ",
                floatNum(networkStatus.fpps_mining_earnings, 8),
                " ",
                coinType,
                " \u2248 ",
                fpps_income)),
        networkStatus.difficulty_change ?
            React.createElement(View, { style: { width: '100%' } },
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, I18n.t('network_estimated_nest')),
                    React.createElement(Text, { style: styles.value }, next_diff)),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, I18n.t('network_time_remain')),
                    React.createElement(Text, { style: styles.value }, times_remain))) : null));
};
const styles = StyleSheet.create({
    network: {
        // flex: 1,
        width: '100%',
        // padding:'5%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'relative',
        top: 0,
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        marginBottom: '5%',
        justifyContent: 'center',
    },
    caption_text: {
        color: '#999999',
        position: 'absolute',
        fontWeight: 'bold',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },
    item: {
        width: '100%',
        height: 38,
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    text: {
        fontSize: adapt.setSpText(14),
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        color: '#999999',
    },
    value: {
        color: '#666666',
        position: 'absolute',
        right: adapt.pxToDp(15),
        textAlign: 'right',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
});
//# sourceMappingURL=NetworkInfo.js.map