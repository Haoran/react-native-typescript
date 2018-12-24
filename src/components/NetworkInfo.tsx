import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import adapt from "../interfaces/adapt";
import {formatBigNum} from "../interfaces/utils";
import moment from "moment";
import I18n from "../interfaces/i18n";

const lang = "zh-cn";
const floatNum = (v, n) => {
    return parseFloat(v).toFixed(n)
}


export const NetworkInfo = (props: any) => {

    const {networkStatus, coinType} = props;

    const re_coinType = coinType == 'BCH' ? "BCC" : coinType;
    const fpps_income = lang == "zh-cn" ? "￥" + floatNum(networkStatus.exchange_rate[re_coinType + "2CNY"] * networkStatus.fpps_mining_earnings, 2) :
        "$" + floatNum(networkStatus.exchange_rate[re_coinType + "2USD"] * networkStatus.fpps_mining_earnings, 2);

    const next_diff = networkStatus.difficulty_change ? networkStatus.difficulty_change + "(" + formatBigNum(networkStatus.estimated_next_difficulty) + ")" : "-";
    const times_remain = networkStatus.time_remain ? moment(moment.unix(networkStatus.time_remain)).fromNow() : "-";

    return (
        <View style={styles.network}>

            <View style={styles.caption}>
                <Text style={styles.caption_text}>{I18n.t('network_title')}</Text>
            </View>

            {
                networkStatus.network_hashrate && networkStatus.network_hashrate != '-' ?
                    <View style={styles.item}>
                        <Text style={styles.text}>{I18n.t('network_hsahtate')}</Text>
                        <Text style={styles.value}>{networkStatus.network_hashrate} {networkStatus.network_hashrate_unit}H/s</Text>
                    </View> : null
            }

            <View style={styles.item}>
                <Text style={styles.text}>{I18n.t('network_pool_hashrate')}</Text>
                <Text style={styles.value}>{networkStatus.pool_hashrate} {networkStatus.pool_hashrate_unit}H/s</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.text}>{I18n.t('network_earn')}</Text>
                <Text style={styles.value}>
                    1{networkStatus.mining_earnings_unit}*24H = {floatNum(networkStatus.fpps_mining_earnings, 8)} {coinType} ≈ {fpps_income}
                </Text>
            </View>

            {
                networkStatus.difficulty_change ?
                    <View style={{width: '100%'}}>
                        <View style={styles.item}>
                            <Text style={styles.text}>{I18n.t('network_estimated_nest')}</Text>
                            <Text style={styles.value}>{next_diff}</Text>
                        </View>

                        < View style={styles.item}>
                            <Text style={styles.text}>{I18n.t('network_time_remain')}</Text>
                            <Text style={styles.value}>{times_remain}</Text>
                        </View>
                    </View> : null
            }
        </View>
    );

}

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
        fontWeight:'bold',
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




