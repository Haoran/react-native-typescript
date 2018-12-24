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
import { formatCoin, height } from "../interfaces/utils";
import HashrateCharts from '../components/HashrateCharts';
import { Icons } from '../components/Icons';
import { WhiteSpace, Flex, ActivityIndicator, SegmentedControl } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import moment from 'moment';
import I18n from "../interfaces/i18n";
let App = class App extends Component {
    constructor(props) {
        super(props);
        this._onPress = (item, coinType) => {
            this.props.navigation.navigate('WebviewPage', { name: I18n.t('pool_status_web_title'), url: height(coinType, item.height) });
        };
        this.handle_page_list = (page) => __awaiter(this, void 0, void 0, function* () {
            this.page = page;
            this.store.getPoolBlocks(this.page);
        });
        this.onChange = (e) => {
            this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
            this.store.getPoolShareHistory(this.dimension);
        };
        this.store = this.props.store.dashboard;
        this.refreshing = false;
        this.dimension = "1h";
    }
    componentWillMount() {
        this.page = 1;
        this.store.getPoolStats();
        this.handle_page_list(1);
        this.store.getPoolShareHistory(this.dimension);
    }
    _onRefresh() {
        this.refreshing = true;
        this.handle_page_list(1).then(() => this.refreshing = false).catch(() => this.refreshing = false);
    }
    _onEndReached() {
        if (this.store.poolBlocks.length >= 20) {
            this.page++;
            this.handle_page_list(this.page);
        }
    }
    render() {
        const { poolStats, poolBlocks, coinType, loading, showFooter, poolShareHistory } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(ActivityIndicator, { text: I18n.t('loading'), toast: true, animating: loading }),
            React.createElement(View, { style: styles.header },
                React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
                    React.createElement(Text, { style: styles.statusTitle },
                        poolStats.shares.shares_15m,
                        " ",
                        poolStats.shares.shares_unit,
                        "H/s"),
                    React.createElement(Text, { style: styles.title }, I18n.t('pool_status_header_hashrate')),
                    React.createElement(WhiteSpace, { size: "lg" }),
                    React.createElement(Text, { style: styles.statusTitle },
                        poolStats.blocks_count,
                        " ",
                        I18n.t('pool_status_web_title')),
                    React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                        React.createElement(Text, { style: styles.title }, I18n.t('pool_status_header_found')))),
                React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
                    React.createElement(Text, { style: styles.statusTitle }, poolStats.workers),
                    React.createElement(Text, { style: styles.title }, I18n.t('pool_status_header_miner')),
                    React.createElement(WhiteSpace, { size: "lg" }),
                    React.createElement(Text, { style: styles.statusTitle },
                        floatNum(formatCoin(poolStats.rewards_count), 0),
                        " ",
                        coinType),
                    React.createElement(Text, { style: styles.title }, I18n.t('pool_status_header_luck')))),
            React.createElement(FlatList, { showsVerticalScrollIndicator: false, style: { width: '100%' }, data: poolBlocks, keyExtractor: item => item.hash.toString(), onEndReached: () => this._onEndReached(), onEndReachedThreshold: 1, ListHeaderComponent: React.createElement(Flex, { direction: "column", align: "end", style: styles.Segmented },
                    React.createElement(SegmentedControl, { values: [I18n.t('hours'), I18n.t('days')], tintColor: '#f7ca18', style: styles.SegmentedControl, onChange: this.onChange }),
                    React.createElement(Flex, { direction: "column", align: "end", style: styles.hashView },
                        React.createElement(HashrateCharts, { shareHistory: poolShareHistory, lineColor: "#999999", dimension: this.dimension })),
                    React.createElement(View, { style: styles.caption },
                        React.createElement(Text, { style: styles.caption_text }, I18n.t('pool_status_block_relayed')))), ListFooterComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(50) } }, showFooter == 0 ?
                    React.createElement(Text, null) :
                    showFooter == 1 ?
                        React.createElement(ActivityIndicator, { text: I18n.t('loading'), animating: showFooter == 1 }) :
                        React.createElement(Text, null, I18n.t('pool_status_no_data'))), ListEmptyComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(120) } }, showFooter == 0 ? React.createElement(Text, null, I18n.t('pool_status_tips')) : null), refreshControl: React.createElement(RefreshControl, { refreshing: this.refreshing, onRefresh: () => this._onRefresh(), title: I18n.t('hard_loading'), titleColor: "#666666", progressBackgroundColor: "#ffff00" }), renderItem: ({ item, separators }) => (React.createElement(TouchableHighlight, { onPress: () => this._onPress(item, coinType), onShowUnderlay: separators.highlight, onHideUnderlay: separators.unhighlight },
                    React.createElement(Flex, { style: styles.list },
                        React.createElement(View, { style: styles.separator },
                            React.createElement(Flex, { align: "start", direction: "column", style: { flex: 5 } },
                                React.createElement(Text, { style: styles.text }, item.height),
                                React.createElement(WhiteSpace, null),
                                React.createElement(Text, { style: styles.subhead }, moment(moment.unix(item.created_at)).format('YYYY-MM-DD HH:mm:ss'))),
                            React.createElement(Flex, { align: "end", direction: "column", style: { flex: 4 } },
                                React.createElement(Text, { style: styles.text },
                                    formatCoin(item.rewards),
                                    " ",
                                    coinType)),
                            React.createElement(Flex, { align: "center", justify: "end", style: { flex: 1 } },
                                React.createElement(Icons, { iconName: "arrow_right", width: "8", height: "13" })))))) })));
    }
};
App.navigationOptions = {
    headerTitle: I18n.t('pool_status_nav_title'),
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    }
};
__decorate([
    observable
], App.prototype, "refreshing", void 0);
__decorate([
    observable
], App.prototype, "page", void 0);
__decorate([
    observable
], App.prototype, "dimension", void 0);
App = __decorate([
    inject('store'),
    observer
], App);
export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#EFEFF4',
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
    },
    Segmented: {
        backgroundColor: "#ffffff",
        paddingTop: adapt.pxToDp(12),
        zIndex: 99,
    },
    SegmentedControl: {
        height: adapt.pxToDp(23),
        width: adapt.pxToDp(84),
        marginRight: adapt.pxToDp(20),
        zIndex: 100,
    },
    hashView: {
        backgroundColor: "#ffffff",
        paddingLeft: adapt.pxToDp(15),
        marginTop: adapt.pxToDp(-33),
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
    },
    caption_text: {
        color: '#868686',
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: '5%',
        fontSize: adapt.setSpText(15)
    },
});
const floatNum = (v, n) => {
    return parseFloat(v).toFixed(n);
};
//# sourceMappingURL=PoolStats.js.map