var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, Keyboard } from 'react-native';
import { Flex, List, SearchBar, ActivityIndicator, } from 'antd-mobile-rn';
import adapt from '../interfaces/adapt';
import { Icons } from '../components/Icons';
import { inject, observer } from "mobx-react";
import ListStyle from 'antd-mobile-rn/lib/list/style/index.native';
import { DeviceEventEmitter } from 'react-native';
import { observable } from "mobx";
import I18n from "../interfaces/i18n";
const Item = List.Item;
let SubAccount = class SubAccount extends Component {
    constructor(props) {
        super(props);
        this.appStore = this.props.store.appStore;
        this.filter = "";
        this.initNoList = false;
    }
    componentWillMount() {
        this.appStore.isHidden = 1;
        this.appStore.moreList();
    }
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('onHiddenRefresh', () => {
            this.appStore.refreshing = false;
            this.appStore.isHidden = 1;
            this.appStore.moreList().then(() => DeviceEventEmitter.emit('onRefresh'));
        });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    _onRefresh() {
        this.appStore.refreshing = true;
        this.appStore.moreList();
    }
    render() {
        const { HidAccountList, loading, coins_pic } = this.appStore;
        const list = HidAccountList.filter(a => a.name.indexOf(this.filter) >= 0);
        return (React.createElement(Flex, { direction: "column", justify: "start", style: styles.container },
            React.createElement(SearchBar, { placeholder: "Search", style: styles.search, value: this.filter, onCancel: () => Keyboard.dismiss(), onChange: (v) => { this.filter = v.trim(); this.initNoList = true; } }),
            React.createElement(ActivityIndicator, { text: I18n.t('loading'), toast: true, animating: loading }),
            React.createElement(ScrollView, { style: styles.contentContainer, refreshControl: React.createElement(RefreshControl, { refreshing: this.appStore.refreshing, onRefresh: () => this._onRefresh(), title: I18n.t('hard_loading'), titleColor: "#666666", progressBackgroundColor: "#ffff00" }) },
                list.length == 0 && this.initNoList ?
                    React.createElement(Flex, { direction: "row", justify: "center", align: "center", style: { width: '100%' } },
                        React.createElement(Text, { style: styles.noAccount }, I18n.t('unable_search_sub_account')))
                    : null,
                list.map(item => {
                    return (React.createElement(View, { style: styles.list, key: item.name },
                        React.createElement(View, { style: styles.title },
                            React.createElement(Text, null,
                                item.name,
                                " - ",
                                item.region_text,
                                " ")),
                        item.algorithms.map(alg => {
                            return (React.createElement(List, { styles: _ListStyle, key: alg.algorithm_name, renderHeader: () => `${alg.algorithm_name.toUpperCase()} - (${I18n.t('current_mode')} ${alg.current_mode_text})` }, alg.coin_accounts.map(account => {
                                return (React.createElement(Item, { key: account.coin_type, arrow: "horizontal", onClick: () => this.props.navigation.navigate('CancleAccount', { account: account }) },
                                    React.createElement(Flex, { direction: "row", align: "center" },
                                        account.is_current == 1 ?
                                            React.createElement(View, { style: styles.point })
                                            :
                                                React.createElement(View, { style: { marginRight: adapt.pxToDp(15) } }),
                                        React.createElement(View, { style: styles.rip },
                                            React.createElement(Icons, { uri: coins_pic[account.coin_type.toLowerCase()] })),
                                        React.createElement(Text, { style: styles.chd }, account.coin_type))));
                            })));
                        })));
                }))));
    }
};
SubAccount.navigationOptions = {
    headerTitle: I18n.t('hide_subaccount_manage'),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
};
__decorate([
    observable
], SubAccount.prototype, "filter", void 0);
__decorate([
    observable
], SubAccount.prototype, "initNoList", void 0);
SubAccount = __decorate([
    inject('store'),
    observer
], SubAccount);
export default SubAccount;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
    },
    loading: {
        width: '100%',
        height: adapt.pxToDp(400),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    search: {
        // backgroundColor: 'rgba(142,142,147,0.3)',
        borderRadius: 6,
        height: adapt.pxToDp(30)
    },
    list: {
        marginBottom: adapt.pxToDp(30),
        marginTop: adapt.pxToDp(10)
    },
    title: {
        paddingLeft: adapt.pxToDp(10),
        height: adapt.pxToDp(30),
        borderLeftWidth: adapt.pxToDp(2),
        borderLeftColor: '#22a7f0',
        justifyContent: 'center',
        backgroundColor: '#e6e9ee'
    },
    point: {
        width: adapt.pxToDp(7),
        height: adapt.pxToDp(7),
        backgroundColor: 'rgba(102,187,68,1)',
        borderRadius: 10,
        marginRight: adapt.pxToDp(8)
    },
    chd: {
        width: adapt.pxToDp(70),
        fontWeight: 'bold',
        color: 'color:rgba(3,3,3,1);',
        marginLeft: adapt.pxToDp(13)
    },
    noAccount: {
        paddingTop: adapt.pxToDp(30),
        color: '#999999',
        fontSize: adapt.setSpText(14),
        textAlign: 'center'
    },
    rip: {
        width: adapt.pxToDp(30),
        height: adapt.pxToDp(30),
        borderRadius: adapt.pxToDp(15),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
const _ListStyle = Object.assign({}, ListStyle, { Header: Object.assign({}, ListStyle.Header, { fontSize: adapt.setSpText(11), color: '#6D6D72', paddingTop: adapt.pxToDp(12), paddingBottom: adapt.pxToDp(3) }) });
//# sourceMappingURL=HidSubAccount.js.map