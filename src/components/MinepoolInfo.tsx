import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {Icons} from '../components/Icons';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator} from 'antd-mobile-rn';
import {formatCoin} from "../interfaces/utils";
import adapt from "../interfaces/adapt";
import I18n from "../interfaces/i18n";

export const MinepoolInfo = (props: any) => {

    const {earnStats, workStats, account, onToast} = props;
    
    return (
        <View style={styles.header}>
            <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                <Text style={styles.statusTitle}>
                    {workStats.shares_15m} {workStats.shares_unit ? workStats.shares_unit : 'G'}H/s
                </Text>
                <Text style={styles.title}>{I18n.t('share_24H')} {earnStats.shares_1d.size} {earnStats.shares_1d.unit}H/s</Text>

                <WhiteSpace size="lg"/>
                <Text style={styles.statusTitle}>
                    {formatCoin(earnStats.unpaid)} {account.coin_type}
                </Text>
                <TouchableOpacity onPress={() => {
                    onToast(I18n.t('clock_balance_tips'))
                }}>
                    <Flex direction="row" justify="center" align="center">
                        <Text style={styles.title}>{I18n.t('balance')}</Text>
                        <Icons iconName="icon_header_Detail" width="10" height="10"/>
                    </Flex>
                </TouchableOpacity>

                <WhiteSpace size="lg"/>
                <Text style={styles.statusTitle}>
                    {earnStats.hashrate_yesterday.size} {earnStats.hashrate_yesterday.unit}H/s
                </Text>
                <Text style={styles.title}>{I18n.t('hash_of_yesterday')}</Text>
            </Flex>

            <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                <Text style={styles.statusTitle}>
                    {workStats.workers_total} {I18n.t('miner')}
                </Text>
                <Text style={styles.title}>
                    {I18n.t('active')}:{workStats.workers_active} {I18n.t('inactive')}:{workStats.workers_inactive}
                </Text>

                <WhiteSpace size="lg"/>
                <Text style={styles.statusTitle}>
                    {formatCoin(earnStats.earnings_today)} {account.coin_type}
                </Text>
                <TouchableOpacity onPress={() => {
                    onToast(I18n.t('clock_today_tips'))
                }}>
                    <Flex direction="row" justify="center" align="center">
                        <Text style={styles.title}>{I18n.t('earn_today')}</Text>
                        <Icons iconName="icon_header_Detail" width="10" height="10"/>
                    </Flex>
                </TouchableOpacity>

                <WhiteSpace size="lg"/>
                <Text style={styles.statusTitle}>
                    {formatCoin(earnStats.earnings_yesterday)} {account.coin_type}
                </Text>
                <TouchableOpacity onPress={() => {
                    onToast(I18n.t('clock_yestoday_tips'))
                }}>
                    <Flex direction="row" justify="center" align="center">
                        <Text style={styles.title}>{I18n.t('earn_yestoday')}</Text>
                        <Icons iconName="icon_header_Detail" width="10" height="10"/>
                    </Flex>
                </TouchableOpacity>
            </Flex>
        </View>
    )
}

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
        // fontWeight: "bold"
    },
    title: {
        fontSize: adapt.setSpText(12),
        color: '#ffffff',
        opacity: 0.7,
        marginRight: adapt.pxToDp(5)
    },


    minepool_item: {
        width: '50%',
        // backgroundColor: '#f2f6fb',
        // opacity:0.5,
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




