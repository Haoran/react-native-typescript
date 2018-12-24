var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, } from 'react-native';
import { Flex, List, WhiteSpace, Picker, Switch } from 'antd-mobile-rn';
import { Icons } from '../../components/Icons';
import adapt from "../../interfaces/adapt";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { DeviceEventEmitter } from 'react-native';
const Item = List.Item;
let Setting = class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.handleAlertInterval = (v, account) => {
            this.store.setAlertInterval(account.region_id, account.puid, v);
        };
        this.getHoursArray = () => {
            let hours = new Array();
            for (let i = 2; i <= 24; i++) {
                hours.push({ label: i + ' hours', value: i });
            }
            return hours;
        };
        this.onSwitchChange = (v, regionID, puid) => {
            this.isHidden = v;
            this.store.hideAccount(regionID, 'set', puid).then(res => {
                if (res) {
                    DeviceEventEmitter.emit('onRefresh');
                    this.props.navigation.goBack();
                }
                else {
                    this.isHidden = false;
                }
            });
        };
        this.store = this.props.store.modifyAccount;
        this.appStore = this.props.store.appStore;
        this.isHidden = this.props.navigation.state.params.account.is_hidden == 0 ? false : true;
    }
    componentWillMount() {
        const { account } = this.props.navigation.state.params;
        this.store.getAccountInfo(account.region_id, account.puid);
    }
    render() {
        const { account, current_regionId, current_puid, current_mode, support_coins } = this.props.navigation.state.params;
        const { accountInfo } = this.store;
        return (React.createElement(ScrollView, { style: styles.contentContainer, showsHorizontalScrollIndicator: false },
            React.createElement(List, { renderHeader: () => 'SUB-ACCOUNTS SETTING' },
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('ModifyAddress', {
                        address: accountInfo.address,
                        name: 'Payment Address',
                    }) }, "Payment Address"),
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('ModifyAddress', {
                        address: accountInfo.nmc_address,
                        name: 'NMC Subsidy Address',
                    }) }, "NMC Subsidy Address"),
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('OneButtonSwitch', {
                        current_regionId: current_regionId,
                        current_puid: current_puid,
                        current_mode: current_mode,
                        support_coins: support_coins
                    }) }, "One-button switch")),
            React.createElement(List, { renderHeader: () => 'ALERT SETTING' },
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('AlertSettingHashrate', {
                        regionId: account.region_id,
                        puid: account.puid,
                        hashrate_alert: accountInfo.alert.hashrate_alert,
                        hashrate_value: accountInfo.alert.hashrate_value,
                        hashrate_unit: accountInfo.alert.hashrate_unit,
                    }) },
                    React.createElement(Text, { style: styles.text },
                        "Warn me when hashrate \u2264 ",
                        accountInfo.alert.hashrate_value,
                        " ",
                        accountInfo.alert.hashrate_unit,
                        "H/s")),
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('AlertSettingMiner', {
                        regionId: account.region_id,
                        puid: account.puid,
                        miner_alert: accountInfo.alert.miner_alert,
                        miner_value: accountInfo.alert.miner_value,
                    }) },
                    React.createElement(Text, { style: styles.text },
                        "Warn me when active miner \u2264 ",
                        accountInfo.alert.miner_value)),
                React.createElement(Item, { extra: React.createElement(Picker, { okText: "\u786E\u5B9A", dismissText: "\u53D6\u6D88", data: this.getHoursArray(), cols: 1, value: [accountInfo.alert.alert_interval], onOk: (v) => {
                            this.handleAlertInterval(v[0], account);
                        } },
                        React.createElement(CustomChildren, null)) },
                    React.createElement(Text, { style: styles.text },
                        "Don\u2019t warn me twice in ",
                        accountInfo.alert.alert_interval,
                        " hours"))),
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('AlertContact', {
                    regionId: account.region_id,
                    puid: account.puid,
                }) }, "Alert Contacts"),
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('Watchers', {
                    puid: account.puid,
                }) }, "Share to Watcher"),
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('Earning', {
                    regionId: account.region_id,
                    puid: account.puid,
                    coinType: account.coin_type,
                }) }, "View Earnings History"),
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(Item, { extra: React.createElement(Switch, { checked: this.isHidden, onChange: v => this.onSwitchChange(v, account.region_id, account.puid) }) }, "Hide")));
    }
};
Setting.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.account.name + '@' + navigation.state.params.account.coin_type + '-' + navigation.state.params.account.region_text,
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
__decorate([
    observable
], Setting.prototype, "isHidden", void 0);
Setting = __decorate([
    inject('store'),
    observer
], Setting);
export default Setting;
const CustomChildren = (props) => (React.createElement(TouchableOpacity, { onPress: props.onClick },
    React.createElement(Flex, { justify: 'end', align: "center", style: { height: adapt.pxToDp(20), width: adapt.pxToDp(60) } },
        React.createElement(Icons, { iconName: "arrow_right", width: "8", height: "13" }))));
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
    },
    text: {
        fontSize: adapt.setSpText(17)
    }
});
//# sourceMappingURL=Setting.js.map