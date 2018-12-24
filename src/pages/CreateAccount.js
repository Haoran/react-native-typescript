var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, } from 'react-native';
import { Flex, WhiteSpace, WingBlank, Button, } from 'antd-mobile-rn';
import adapt from '../interfaces/adapt';
import { Icons } from '../components/Icons';
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import Notice from '../components/Notice';
import { NavigationActions, StackActions } from 'react-navigation';
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';
import { TabNav } from "../interfaces/tabnav";
import I18n from "../interfaces/i18n";
const lang = I18n.getLanguage();
let Create = class Create extends Component {
    constructor(props) {
        super(props);
        this.handleUpdateCoin = (coinType) => {
            this.coin_type = coinType.toUpperCase();
            const region = this.store.nodeList.filter(region => region.type == this.coin_type);
            this.regionID = region[0] ? region[0].id : "";
            this.regionName = region[0] ? region[0].name : "";
        };
        this.handleUpdateRegion = (region) => {
            this.regionID = region.id;
            this.regionName = region.name;
        };
        this.automatic = () => {
            let random = Math.random().toString(36).replace(/i/g, 'j').replace(/l/g, 'm').replace(/o/g, 'p').replace(/1/g, '2').replace(/0/g, '3').substr(2, 8);
            this.name = random;
        };
        this.create = () => {
            if (!this.regionID) {
                this.store.waringDisplay = true;
                this.store.waringText = I18n.t("creat_worker_region");
                return;
            }
            if (!this.name) {
                this.store.waringDisplay = true;
                this.store.waringText = I18n.t("creat_worker_finish");
                return;
            }
            this.store.create(this.regionID, this.regionName, this.name, this.coin_type, this.address)
                .then(res => {
                if (res) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'TabNav' })]
                    });
                    this.appStore.onChangeTab(TabNav.Dashboard);
                    this.dashboard.puid = res[0];
                    this.dashboard.regionID = res[1];
                    this.props.navigation.dispatch(resetAction);
                }
            });
        };
        this.store = this.props.store.create;
        this.appStore = this.props.store.appStore;
        this.dashboard = this.props.store.dashboard;
        this.coin_type = 'BTC';
        this.regionID = "";
        this.address = "";
    }
    componentWillMount() {
        this.store.getCoinsPic();
        this.store.getNodeList().then(res => {
            const region = this.store.nodeList.filter(region => region.type == this.coin_type);
            this.regionID = region[0] ? region[0].id : "";
            this.regionName = region[0] ? region[0].name : "";
        });
    }
    authDispaly() {
        this.store.waringDisplay = false;
    }
    render() {
        const { coins, nodeList, loading, waringDisplay, waringText } = this.store;
        return (React.createElement(ScrollView, { contentContainerStyle: styles.container, showsVerticalScrollIndicator: false },
            React.createElement(Notice, { content: waringText, display: waringDisplay, authDispaly: () => this.authDispaly() }),
            React.createElement(View, { style: { marginTop: adapt.pxToDp(20) } },
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: { fontSize: adapt.setSpText(13) } }, I18n.t("creat_worker_cointype"))),
                React.createElement(View, { style: styles.scrollView },
                    React.createElement(ScrollView, { horizontal: true, contentContainerStyle: styles.area, showsHorizontalScrollIndicator: false }, Object.keys(coins).map(item => {
                        return (React.createElement(TouchableOpacity, { onPress: () => this.handleUpdateCoin(item), key: item },
                            React.createElement(Flex, { direction: "row" },
                                React.createElement(View, { style: this.coin_type == item.toUpperCase() ? styles.scrollActive : styles.scroll },
                                    React.createElement(Icons, { uri: coins[item], width: "25", height: "25" }),
                                    React.createElement(Text, { style: this.coin_type == item.toUpperCase() ? styles.textActive : styles.text }, item.toUpperCase())),
                                React.createElement(View, { style: styles.line }))));
                    }))),
                React.createElement(WhiteSpace, { size: "sm" }),
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: styles.note },
                        I18n.t("creat_worker_dec"),
                        Object.keys(coins).map(t => t.toUpperCase() + '、'),
                        " ",
                        I18n.t("creat_worker_look")))),
            React.createElement(View, { style: { marginTop: adapt.pxToDp(20) } },
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: { fontSize: adapt.setSpText(13) } }, I18n.t("creat_worker_select_region"))),
                React.createElement(View, { style: styles.scrollView },
                    React.createElement(ScrollView, { horizontal: true, contentContainerStyle: styles.area, showsHorizontalScrollIndicator: false }, nodeList.map(region => {
                        return (region.type == this.coin_type ?
                            React.createElement(TouchableOpacity, { onPress: () => this.handleUpdateRegion(region), key: region.id },
                                React.createElement(Flex, { direction: "row" },
                                    React.createElement(View, { style: this.regionID == region.id ? styles.scrollActive : styles.scroll },
                                        React.createElement(Icons, { uri: region.config.app_country_pic, width: "25", height: "25" }),
                                        React.createElement(Text, { style: this.regionID == region.id ? styles.textActive : styles.text }, region.config.text[lang])),
                                    React.createElement(View, { style: styles.line })))
                            : null);
                    }))),
                React.createElement(WhiteSpace, { size: "sm" }),
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: styles.note }, I18n.t("creat_worker_select_region_tips")))),
            React.createElement(View, { style: { marginTop: adapt.pxToDp(20) } },
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: { fontSize: adapt.setSpText(13) } }, I18n.t("creat_worker_set_name"))),
                React.createElement(View, { style: styles.inputView },
                    React.createElement(TextInput, { style: styles.input, maxLength: 20, placeholder: I18n.t("creat_worker_set_name_placehold"), value: this.name, onChangeText: (text) => this.name = text }),
                    React.createElement(TouchableOpacity, { onPress: () => {
                            this.automatic();
                        } },
                        React.createElement(Text, { style: { color: '#22A7F0', fontSize: adapt.setSpText(15) } }, "Automatic"))),
                React.createElement(WhiteSpace, { size: "sm" }),
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: styles.note }, I18n.t("creat_worker_set_name_tips")))),
            React.createElement(View, { style: { marginTop: adapt.pxToDp(20) } },
                React.createElement(WingBlank, { style: { flexDirection: "row" } },
                    React.createElement(Text, { style: { fontSize: adapt.setSpText(13) } },
                        I18n.t("creat_worker_set_address"),
                        " "),
                    React.createElement(Text, { style: { color: '#FF3B30' } }, I18n.t("creat_worker_option"))),
                React.createElement(View, { style: styles.inputView },
                    React.createElement(TextInput, { style: styles.input, value: this.address, onChangeText: (text) => this.address = text })),
                React.createElement(WhiteSpace, { size: "sm" }),
                React.createElement(WingBlank, null, this.coin_type.toLowerCase() == 'btc' || this.coin_type.toLowerCase() == 'ubtc' || this.coin_type.toLowerCase() == 'bch' ?
                    React.createElement(Text, { style: Object.assign(styles.note, { color: '#FF3B30' }) }, I18n.t("creat_optional_" + this.coin_type.toLowerCase())) :
                    React.createElement(Text, { style: Object.assign(styles.note, { color: '#FF3B30' }) }, I18n.t("creat_optional_coin")))),
            React.createElement(Button, { onPressOut: () => this.create(), style: styles.submit, styles: _btnStyle, disabled: loading, loading: loading }, I18n.t("creat_worker_go_mining"))));
    }
};
Create.navigationOptions = {
    headerTitle: I18n.t("creat_worker_title"),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
};
__decorate([
    observable
], Create.prototype, "name", void 0);
__decorate([
    observable
], Create.prototype, "coin_type", void 0);
__decorate([
    observable
], Create.prototype, "regionID", void 0);
__decorate([
    observable
], Create.prototype, "regionName", void 0);
__decorate([
    observable
], Create.prototype, "address", void 0);
Create = __decorate([
    inject('store'),
    observer
], Create);
export default Create;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
    },
    scrollView: {
        height: adapt.pxToDp(62),
        marginTop: adapt.pxToDp(6),
    },
    area: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.12)',
        minWidth: '100%'
    },
    scroll: {
        paddingTop: adapt.pxToDp(8),
        minWidth: adapt.pxToDp(80),
        height: adapt.pxToDp(62),
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    scrollActive: {
        paddingTop: adapt.pxToDp(8),
        minWidth: adapt.pxToDp(80),
        height: adapt.pxToDp(62),
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        borderColor: '#22A7F0',
        borderBottomWidth: 2
    },
    text: {
        height: adapt.pxToDp(20),
        lineHeight: adapt.pxToDp(20),
        color: '#999999',
        marginTop: adapt.pxToDp(3),
        fontSize: adapt.setSpText(14),
        paddingLeft: adapt.pxToDp(3),
        paddingRight: adapt.pxToDp(3),
    },
    textActive: {
        height: adapt.pxToDp(20),
        lineHeight: adapt.pxToDp(20),
        color: '#22A7F0',
        marginTop: adapt.pxToDp(3),
        paddingLeft: adapt.pxToDp(3),
        paddingRight: adapt.pxToDp(3),
        fontSize: adapt.setSpText(14)
    },
    note: {
        fontSize: adapt.pxToDp(11),
        lineHeight: adapt.pxToDp(15),
        color: '#8E8E93'
    },
    inputView: {
        height: adapt.pxToDp(40),
        marginTop: adapt.pxToDp(6),
        backgroundColor: '#ffffff',
        width: adapt.screenW(),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: adapt.pxToDp(15),
        paddingRight: adapt.pxToDp(15)
    },
    input: {
        flex: 4,
        height: adapt.pxToDp(40),
    },
    submit: {
        marginTop: adapt.pxToDp(40),
        backgroundColor: '#ffffff',
        width: adapt.screenW(),
        height: adapt.pxToDp(40),
        borderWidth: 0
    },
    line: {
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        borderRightWidth: 1,
        height: adapt.pxToDp(20)
    }
});
const _btnStyle = Object.assign({}, btnStyle, { defaultRawText: Object.assign({}, btnStyle.defaultRawText, { color: '#22A7F0', fontSize: adapt.setSpText(16) }) });
//# sourceMappingURL=CreateAccount.js.map