import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import {Flex, List, WhiteSpace, WingBlank, Picker, Switch} from 'antd-mobile-rn';
import {Icons} from '../../components/Icons';
import adapt from "../../interfaces/adapt";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import  {DeviceEventEmitter} from 'react-native';

const Item = List.Item;

@inject('store')
@observer
export default class Setting extends React.Component<any, any> {

    public store: any;
    public appStore: any;
    @observable isHidden: boolean;
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.account.name + '@' + navigation.state.params.account.coin_type + '-' + navigation.state.params.account.region_text,
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });


    constructor(props: any) {
        super(props);
        this.store = this.props.store.modifyAccount;
        this.appStore = this.props.store.appStore;
        this.isHidden = this.props.navigation.state.params.account.is_hidden == 0 ? false : true;
    }

    componentWillMount() {
        const {account} = this.props.navigation.state.params;
        this.store.getAccountInfo(account.region_id, account.puid);
    }

    handleAlertInterval = (v, account) => {
        this.store.setAlertInterval(account.region_id, account.puid, v)
    }

    getHoursArray = () => {
        let hours = new Array();
        for (let i = 2; i <= 24; i++) {
            hours.push({label: i + ' hours', value: i});
        }
        return hours;
    }

    onSwitchChange = (v, regionID, puid) => {

        this.isHidden = v;
        this.store.hideAccount(regionID, 'set', puid).then(res =>{
            if(res){
                DeviceEventEmitter.emit('onRefresh');
                this.props.navigation.goBack();
            }else{
                this.isHidden = false;
            }
        })
    }

    render() {
        const {account, current_regionId, current_puid, current_mode, support_coins} = this.props.navigation.state.params;
        const {accountInfo} = this.store;
        return (
            <ScrollView style={styles.contentContainer} showsHorizontalScrollIndicator={false}>


                <List renderHeader={() => 'SUB-ACCOUNTS SETTING'}>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('ModifyAddress',
                              {
                                  address: accountInfo.address,
                                  name: 'Payment Address',
                              })}
                    >
                        Payment Address
                    </Item>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('ModifyAddress',
                              {
                                  address: accountInfo.nmc_address,
                                  name: 'NMC Subsidy Address',
                              })}
                    >
                        NMC Subsidy Address
                    </Item>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('OneButtonSwitch',
                              {
                                  current_regionId: current_regionId,
                                  current_puid: current_puid,
                                  current_mode: current_mode,
                                  support_coins: support_coins
                              })}
                    >
                        One-button switch
                    </Item>
                </List>

                <List renderHeader={() => 'ALERT SETTING'}>
                    <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertSettingHashrate',
                        {
                            regionId: account.region_id,
                            puid: account.puid,
                            hashrate_alert: accountInfo.alert.hashrate_alert,
                            hashrate_value: accountInfo.alert.hashrate_value,
                            hashrate_unit: accountInfo.alert.hashrate_unit,
                        })}>
                        <Text style={styles.text}>
                            Warn me when hashrate ≤ {accountInfo.alert.hashrate_value} {accountInfo.alert.hashrate_unit}H/s
                        </Text>
                    </Item>
                    <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertSettingMiner',
                        {
                            regionId: account.region_id,
                            puid: account.puid,
                            miner_alert: accountInfo.alert.miner_alert,
                            miner_value: accountInfo.alert.miner_value,
                        })}>
                        <Text style={styles.text}>
                            Warn me when active miner ≤ {accountInfo.alert.miner_value}
                        </Text>
                    </Item>
                    <Item extra={
                        <Picker
                            okText="确定"
                            dismissText="取消"
                            data={this.getHoursArray()}
                            cols={1}
                            value={[accountInfo.alert.alert_interval]}
                            onOk={(v: any) => {
                                this.handleAlertInterval(v[0], account)
                            }}
                        >
                            <CustomChildren/>
                        </Picker>
                    }>
                        <Text style={styles.text}>
                            Don’t warn me twice in {accountInfo.alert.alert_interval} hours
                        </Text>
                    </Item>
                </List>

                <WhiteSpace size="xl"/>
                <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertContact',
                    {
                        regionId: account.region_id,
                        puid: account.puid,
                    })}
                >
                    Alert Contacts
                </Item>

                <WhiteSpace size="xl"/>
                <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('Watchers', {
                    puid: account.puid,
                })}
                >
                    Share to Watcher
                </Item>

                <WhiteSpace size="xl"/>
                <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('Earning', {
                    regionId: account.region_id,
                    puid: account.puid,
                    coinType: account.coin_type,
                })}>
                    View Earnings History
                </Item>

                <WhiteSpace size="xl"/>
                <Item
                    extra={
                        <Switch
                            checked={this.isHidden}
                            onChange={v => this.onSwitchChange(v, account.region_id, account.puid)}
                        />
                    }>
                    Hide
                </Item>

            </ScrollView>
        )
    }
}

const CustomChildren = (props: any) => (
    <TouchableOpacity onPress={props.onClick}>
        <Flex justify='end' align="center" style={{height: adapt.pxToDp(20), width: adapt.pxToDp(60)}}>
            <Icons iconName="arrow_right" width="8" height="13"/>
        </Flex>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
        // alignItems:'center'
    },
    text: {
        fontSize: adapt.setSpText(17)
    }
})