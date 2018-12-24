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
import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableHighlight } from 'react-native';
import adapt from "../interfaces/adapt";
import { formatCoin, txhash } from "../interfaces/utils";
import { Icons } from '../components/Icons';
import { WhiteSpace, Flex, ActivityIndicator } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { navType } from "../interfaces/navType";
import { NavBar } from '../components/NavBar';
import Notice from '../components/Notice';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import I18n from "../interfaces/i18n";
const navConfig = {
    leftContent: {
        type: navType.empty,
    },
    title: {
        type: navType.text,
        text: 'Earnings'
    },
    rightContent: {
        type: navType.empty,
    }
};
let App = class App extends Component {
    constructor(props) {
        super(props);
        this._onToast = (v) => {
            this.noticeContent = v;
            this.display = true;
        };
        this._onPress = (item, coinType) => {
            this.props.navigation.navigate('WebviewPage', { name: I18n.t("earings_header_view_transaction"), url: txhash(coinType, item.payment_tx) });
        };
        this.handle_page_list = (page) => __awaiter(this, void 0, void 0, function* () {
            this.page = page;
            if (this.istabNavgation) {
                this.store.getEarnHistory(this.page);
            }
            else {
                this.store.getEarnHistory(this.page, this.regionId, this.puid);
            }
        });
        this.store = this.props.store.dashboard;
        this.istabNavgation = true; // 是否是tab
        this.refreshing = false;
        this.loading = false;
        this.page = 1;
        this.noticeContent = '';
        this.display = false;
        if (this.props.navigation.state.params) {
            const { regionId, puid, coinType } = this.props.navigation.state.params;
            this.regionId = regionId;
            this.puid = puid;
            this.store.coinType = coinType;
            this.istabNavgation = false;
        }
    }
    componentWillMount() {
        this.loading = true;
        this.istabNavgation ? this.store.getEarnStats() : this.store.getEarnStats(this.regionId, this.puid);
        this.handle_page_list(1).then(() => this.loading = false).catch(() => this.loading = false);
    }
    _onRefresh() {
        this.refreshing = true;
        this.handle_page_list(1).then(() => this.refreshing = false).catch(() => this.refreshing = false);
    }
    _onEndReached() {
        if (this.store.earnHistory.length >= 20) {
            this.page++;
            this.handle_page_list(this.page);
        }
    }
    authDispaly() {
        this.display = false;
    }
    render() {
        const { earnStats, coinType, earnHistory, showFooter } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(Notice, { content: this.noticeContent, display: this.display, authDispaly: () => this.authDispaly() }),
            React.createElement(Flex, null, this.istabNavgation ?
                React.createElement(View, { style: styles.tabNav },
                    React.createElement(NavBar, { title: navConfig.title, leftContent: navConfig.leftContent, rightContent: navConfig.rightContent })) : null),
            React.createElement(View, { style: styles.header },
                React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
                    React.createElement(Text, { style: styles.statusTitle },
                        formatCoin(earnStats.earnings_today),
                        " ",
                        coinType),
                    React.createElement(TouchableHighlight, { onPress: () => {
                            this._onToast(I18n.t('earings_header_view_today_tips'));
                        } },
                        React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                            React.createElement(Text, { style: styles.title }, I18n.t("earings_header_view_today")),
                            React.createElement(Icons, { iconName: "icon_header_Detail", width: "10", height: "10" }))),
                    React.createElement(WhiteSpace, { size: "lg" }),
                    React.createElement(Text, { style: styles.statusTitle },
                        formatCoin(earnStats.total_paid),
                        " ",
                        coinType),
                    React.createElement(Text, { style: styles.title }, I18n.t("earings_header_view_total_paid"))),
                React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
                    React.createElement(Text, { style: styles.statusTitle },
                        formatCoin(earnStats.earnings_yesterday),
                        " ",
                        coinType),
                    React.createElement(TouchableHighlight, { onPress: () => {
                            this._onToast(I18n.t('earings_header_view_yestoday_tips'));
                        } },
                        React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                            React.createElement(Text, { style: styles.title }, I18n.t("earings_header_view_yestoday")),
                            React.createElement(Icons, { iconName: "icon_header_Detail", width: "10", height: "10" }))),
                    React.createElement(WhiteSpace, { size: "lg" }),
                    React.createElement(Text, { style: styles.statusTitle },
                        formatCoin(earnStats.unpaid),
                        " ",
                        coinType),
                    React.createElement(Text, { style: styles.title }, I18n.t("earings_header_view_unpaid")))),
            React.createElement(FlatList, { showsVerticalScrollIndicator: false, style: { width: '100%' }, data: earnHistory, keyExtractor: item => item.date.toString(), onEndReached: () => this._onEndReached(), onEndReachedThreshold: 0, ListFooterComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(50) } }, showFooter == 0 ?
                    React.createElement(Text, null) :
                    showFooter == 1 ?
                        React.createElement(ActivityIndicator, { text: I18n.t("loading"), animating: showFooter == 1 }) :
                        React.createElement(Text, null, I18n.t("pool_status_no_data"))), ListEmptyComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(120) } }, !this.loading ? React.createElement(Text, null, I18n.t("earings_no_data")) : null), refreshControl: React.createElement(RefreshControl, { refreshing: this.refreshing, onRefresh: () => this._onRefresh(), title: I18n.t("hard_loading"), titleColor: "#666666", progressBackgroundColor: "#ffff00" }), renderItem: ({ item, separators }) => (React.createElement(TouchableHighlight, { onPress: () => this._onPress(item, coinType), onShowUnderlay: separators.highlight, onHideUnderlay: separators.unhighlight },
                    React.createElement(Flex, { style: styles.list },
                        React.createElement(View, { style: styles.separator },
                            React.createElement(Flex, { align: "start", direction: "column", style: { flex: 3 } },
                                React.createElement(Text, { style: styles.text }, moment(item.date, "YYYY-MM-DD").format('YYYY-MM-DD')),
                                React.createElement(WhiteSpace, null),
                                React.createElement(Text, { style: styles.subhead },
                                    item.payment_mode,
                                    " ",
                                    I18n.t("earings_cell_model"))),
                            React.createElement(Flex, { align: "end", direction: "column", style: { flex: 5 } },
                                React.createElement(Text, { style: styles.text },
                                    formatCoin(item.paid_amount),
                                    " ",
                                    coinType),
                                React.createElement(WhiteSpace, null),
                                React.createElement(Text, { style: styles.subhead },
                                    I18n.t("earings_cell_pay_time"),
                                    " ",
                                    item.payment_time)),
                            React.createElement(Flex, { align: "center", justify: "end", style: { flex: 1 } },
                                React.createElement(Icons, { iconName: "arrow_right", width: "8", height: "13" })))))) })));
    }
};
App.navigationOptions = {
    headerTitle: I18n.t('tabbar_item_earnings'),
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    }
};
__decorate([
    observable
], App.prototype, "regionId", void 0);
__decorate([
    observable
], App.prototype, "istabNavgation", void 0);
__decorate([
    observable
], App.prototype, "puid", void 0);
__decorate([
    observable
], App.prototype, "coinType", void 0);
__decorate([
    observable
], App.prototype, "refreshing", void 0);
__decorate([
    observable
], App.prototype, "loading", void 0);
__decorate([
    observable
], App.prototype, "page", void 0);
__decorate([
    observable
], App.prototype, "noticeContent", void 0);
__decorate([
    observable
], App.prototype, "display", void 0);
App = __decorate([
    inject('store'),
    observer
], App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },
    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
        lineHeight: adapt.pxToDp(22)
        // color:'#ffffff',
    },
    header: {
        paddingTop: adapt.pxToDp(5),
        paddingBottom: adapt.pxToDp(16),
        backgroundColor: '#22A7F0',
        width: '100%',
        flexDirection: 'row'
    },
    statusTitle: {
        fontSize: adapt.setSpText(16),
        color: '#ffffff',
        marginBottom: adapt.pxToDp(4),
    },
    title: {
        fontSize: adapt.setSpText(12),
        color: '#ffffff',
        opacity: 0.7,
        marginRight: adapt.pxToDp(5)
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    separator: {
        paddingBottom: adapt.pxToDp(13),
        paddingRight: adapt.pxToDp(13),
        paddingTop: adapt.pxToDp(13),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(229,229,229,0.5)',
        marginLeft: adapt.pxToDp(15),
    },
    list: {
        backgroundColor: '#ffffff',
    },
    text: {
        color: '#666666',
        fontSize: adapt.setSpText(15),
        fontFamily: "Helvetica Neue",
    },
    subhead: {
        color: '#999999',
        fontSize: adapt.setSpText(12),
    }
});
export default withNavigation(App);
//# sourceMappingURL=Earning.js.map