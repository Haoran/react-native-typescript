var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import adapt from '../interfaces/adapt';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Icons } from '../components/Icons';
import { Flex, List, WhiteSpace, Button, ActivityIndicator, Picker, Toast } from 'antd-mobile-rn';
import { NavBar } from '../components/NavBar';
import { navType } from '../interfaces/navType';
import { inject, observer } from "mobx-react";
import { NavigationActions, StackActions } from 'react-navigation';
import CookieManager from 'react-native-cookies';
import { reaction } from "mobx";
import { TabNav } from "../interfaces/tabnav";
const Item = List.Item;
const Brief = Item.Brief;
let Setting = class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.getHoursArray = () => {
            let hours = new Array();
            for (let i = 2; i <= 24; i++) {
                hours.push({ label: i + ' hours', value: i });
            }
            return hours;
        };
        this.handleAlertInterval = (v, account) => {
            this.accountStore.setAlertInterval(account.region_id, account.puid, v);
        };
        this.clearAsyncStorage = () => __awaiter(this, void 0, void 0, function* () {
            CookieManager.clearAll().then((res) => {
                console.log('CookieManager.clearAll =>', res);
            });
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Welcome' })]
            });
            const errs = yield AsyncStorage.clear();
            if (errs) {
                Toast.info('退出失败!', 2);
            }
            else {
                console.log("退出成功");
                this.dashboardStore.puid = "";
                this.dashboardStore.regionID = "";
                this.auth.logout();
                this.props.navigation.dispatch(resetAction);
            }
        });
        this.accountStore = this.props.store.modifyAccount;
        this.dashboardStore = this.props.store.dashboard;
        this.appStore = this.props.store.appStore;
        this.auth = this.props.store.auth;
        reaction(() => this.appStore.isConnected, isConnected => this.httpList());
        reaction(() => this.appStore.selectedTab, selectedTab => this.httpList());
    }
    componentWillMount() {
        this.httpList();
    }
    httpList() {
        if (this.appStore.selectedTab == TabNav.Setting) {
            const { regionID, puid } = this.dashboardStore;
            this.accountStore.getAccountInfo(regionID, puid);
        }
    }
    render() {
        const { account } = this.dashboardStore;
        const { accountInfo, loading } = this.accountStore;
        const navConfig = {
            leftContent: {
                type: navType.empty,
            },
            title: {
                type: navType.text,
                text: account.name ? account.name + '@' + account.coin_type + '-' + account.region_text : '-'
            },
            rightContent: {
                type: navType.icon,
                iconName: 'button_header_menu'
            }
        };
        return (React.createElement(Flex, { direction: "column", justify: "start", style: styles.container },
            React.createElement(ActivityIndicator, { text: "\u6B63\u5728\u52A0\u8F7D...", toast: true, animating: loading }),
            React.createElement(View, { style: styles.tabNav },
                React.createElement(NavBar, { title: navConfig.title, leftContent: navConfig.leftContent, rightContent: navConfig.rightContent, handleClick: (type) => type == 'right' ? this.props.navigation.navigate('SubAccount') : null })),
            React.createElement(ScrollView, { style: styles.contentContainer, showsVerticalScrollIndicator: false },
                React.createElement(List, { renderHeader: () => 'BELONG TO ACCOUNT' },
                    React.createElement(Item, null, accountInfo.contact.phone.number ? accountInfo.contact.phone.number : accountInfo.contact.mail)),
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
                            current_regionId: account.currentRegionId,
                            current_puid: accountInfo.current_puid,
                            current_mode: accountInfo.current_mode,
                            support_coins: accountInfo.current_support_coins
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
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('PaymentAddress') }, "Feedback"),
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('Language') }, "Languages"),
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(Flex, { justify: "center" },
                    React.createElement(Button, { type: "warning", style: styles.signOut, onClick: () => this.clearAsyncStorage() }, "Sign out")),
                React.createElement(WhiteSpace, { size: "xl" }))));
    }
};
Setting = __decorate([
    inject('store'),
    observer
], Setting);
const CustomChildren = (props) => (React.createElement(TouchableOpacity, { onPress: props.onClick },
    React.createElement(Flex, { justify: 'end', align: "center", style: { height: adapt.pxToDp(20), width: adapt.pxToDp(60) } },
        React.createElement(Icons, { iconName: "arrow_right", width: "8", height: "13" }))));
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(239,239,244,1)'
    },
    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
    },
    group: {
        borderTopWidth: adapt.pxToDp(1),
        borderBottomWidth: adapt.pxToDp(1),
        borderColor: '#C8C7CC',
        backgroundColor: '#ffffff',
        paddingLeft: adapt.pxToDp(15),
    },
    LabelContent: {
        marginTop: adapt.pxToDp(15),
        borderTopWidth: adapt.pxToDp(1),
        borderBottomWidth: adapt.pxToDp(1),
        borderColor: '#C8C7CC',
    },
    signOut: {
        width: '75%',
        borderRadius: 0,
        backgroundColor: '#ff3b30'
    },
    text: {
        fontSize: adapt.setSpText(17)
    }
});
export default withNavigation(Setting);
//# sourceMappingURL=Setting.js.map