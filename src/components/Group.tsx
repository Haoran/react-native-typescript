import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {WingBlank, WhiteSpace, List, Flex, ActivityIndicator} from 'antd-mobile-rn';
import {compare, formatCoin} from "../interfaces/utils";
import adapt from "../interfaces/adapt";
import loadingStyle from 'antd-mobile-rn/lib/activity-indicator/style/index.native';
import I18n from "../interfaces/i18n";


const Item = List.Item;
const Brief = Item.Brief;

export const Group = (props: any) => {

    const {group, loading, changeTab} = props;

    return (
        <View style={styles.contain}>
            <Flex justify="center" align="center" style={{width: '100%'}}>
                <ActivityIndicator text={I18n.t('loading')} animating={loading} styles={_loadingStyle}/>
            </Flex>
            <List style={{width: '100%'}}>
                {
                    group.length == 0 && !loading ?
                        <Item>
                            <Brief style={{fontSize: adapt.setSpText(14), textAlign: 'center'}}>
                                {I18n.t('unable_get_group_info')}
                            </Brief>
                        </Item> : null
                }
                {
                    group.sort(compare("gid")).map((item, index) => {
                        return (
                            index < 5 ?
                                <Item arrow="horizontal" key={item.gid}
                                      onClick={() => changeTab(item.gid)}
                                >
                                    <Brief style={{
                                        fontSize: adapt.setSpText(14),
                                        color: "#6D6D72"
                                    }}>
                                        {item.name == 'DEFAULT' ? I18n.t('default') : item.name}
                                    </Brief>
                                    <Flex direction="row" justify="start" align="center"
                                          style={{
                                              paddingTop: adapt.pxToDp(9),
                                              paddingBottom: adapt.pxToDp(4)
                                          }}>
                                        <Flex direction="row" justify="start" align="center"
                                              style={{width: adapt.pxToDp(135)}}>
                                            <Text style={styles.text}>{item.shares_15m}</Text>
                                            <Brief style={styles.unit}>{item.shares_unit}H/s</Brief>
                                        </Flex>
                                        <Flex direction="row" justify="start" align="center">
                                            <Text style={styles.text}>
                                                {item.workers_active}/{item.workers_total}
                                            </Text>
                                            <Brief style={styles.unit}>Miners</Brief>
                                        </Flex>
                                    </Flex>
                                </Item> : null)
                    })
                }
            </List>


        </View>
    )
}

const styles = StyleSheet.create({
    contain: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'relative',
        top: 0,
    },
    text: {
        // width: adapt.pxToDp(120),
        color: '#666666',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    unit: {
        color: '#868686',
        fontSize: adapt.setSpText(14),
        paddingTop: 0,
        marginLeft: adapt.pxToDp(3)
    }
});


const _loadingStyle = {
    ...loadingStyle,
    spinner: {
        ...loadingStyle.spinner,
        height: adapt.pxToDp(50),
        backgroundColor: '#ffffff'
    },
}


