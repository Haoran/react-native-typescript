import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {formatCoin} from "../interfaces/utils";
import {Flex, ActivityIndicator, List} from 'antd-mobile-rn';
import adapt from "../interfaces/adapt";
import {TabNav} from '../interfaces/tabnav';
import moment from 'moment';
import I18n from "../interfaces/i18n";

const Item = List.Item;
const Brief = Item.Brief;

export const AccountIncome = (props: any) => {

    const {earnStats, handleTab, coinType} = props;

    return (
        <View style={styles.poolAddress}>

            <View style={styles.caption}>
                <Text style={styles.caption_text}>
                    {I18n.t('account_income')}
                </Text>
                <Text style={styles.caption_more} onPress={() => handleTab(TabNav.Income)}> {I18n.t('more')}</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.text}> {I18n.t('unpaid')}</Text>
                <Flex direction="row" align="center" justify="start" style={styles.value}>
                    <Text style={styles.textValue}>{formatCoin(earnStats.unpaid)}</Text>
                    <Brief style={styles.unit}>{coinType}</Brief>
                </Flex>
            </View>

            <View style={styles.item}>
                <Text style={styles.text}>{I18n.t('total_amount')}</Text>
                <Flex direction="row" align="center" justify="start" style={styles.value}>
                    <Text style={styles.textValue}>{formatCoin(earnStats.total_paid)}</Text>
                    <Brief style={styles.unit}>{coinType}</Brief>
                </Flex>
            </View>

            <View style={styles.item}>
                <Text style={styles.text}>{I18n.t('last_pay_time')}</Text>
                <Text
                    style={styles.value}>{earnStats.last_payment_time==0 ? "-" : moment(moment.unix(earnStats.last_payment_time)).fromNow() }</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.text}>{I18n.t('pending_pay')}</Text>
                <Flex direction="row" align="center" justify="start" style={styles.value}>
                    <Text style={styles.textValue}>{formatCoin(earnStats.pending_payouts)}</Text>
                    <Brief style={styles.unit}>{coinType}</Brief>
                </Flex>
            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    poolAddress: {
        width: '100%',
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
        textAlign: 'left',
        fontWeight:'bold',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },

    caption_more: {
        color: '#2194ed',
        right:0,
        height:'100%',
        padding:adapt.pxToDp(15),
        textAlign: 'right',
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
        position: 'absolute',
        right: adapt.pxToDp(15),
        textAlign: 'right',
        color: '#666666',
    },
    textValue:{
        fontSize: adapt.setSpText(14),
        color: '#666666',
        fontFamily: "Helvetica Neue",
    },
    unit: {
        color: '#666666',
        fontSize: adapt.setSpText(14),
        paddingTop: 0,
        marginLeft: adapt.pxToDp(3)
    }
});




