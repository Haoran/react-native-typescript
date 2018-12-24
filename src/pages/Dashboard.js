var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, } from 'react-native';
import I18n from "../interfaces/i18n";
import { withNavigation } from 'react-navigation';
import adapt from '../interfaces/adapt';
import { navType } from "../interfaces/navType";
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";
import { TabNav } from '../interfaces/tabnav';
import { NavBar } from '../components/NavBar';
import Notice from '../components/Notice';
import { PoolAddress } from '../components/PoolAddress';
import { NetworkInfo } from '../components/NetworkInfo';
import { MinepoolInfo } from '../components/MinepoolInfo';
import { AccountIncome } from '../components/AccountIncome';
import { Group } from '../components/Group';
import HashrateCharts from '../components/HashrateCharts';
import { Flex, WhiteSpace, Button, SegmentedControl, ActivityIndicator, } from 'antd-mobile-rn';
let Dashboard = class Dashboard extends Component {
    constructor(props) {
        super(props);
        this._onToast = (v) => {
            this.noticeContent = v;
            this.display = true;
        };
        this._onHanleLink = (regionEndpoint) => {
            this.props.navigation.navigate('WebviewPage', {
                name: I18n.t("help"),
                url: regionEndpoint + '/app/help'
            });
        };
        this.onChange = (e) => {
            this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
            this.store.getWorkerShareHistory(this.dimension);
        };
        this.changeTab = (v) => {
            this.groupStore.gid = v;
            this.appStore.onChangeTab(TabNav.Miner);
            this.props.navigation.goBack();
            this.groupStore.getWorkerList({
                status: "active",
                group: v,
                page: 1,
                page_size: 20,
                filter: '',
                order_by: "worker_name",
                asc: 0
            });
        };
        this.httpList = () => {
            if (this.appStore.selectedTab == TabNav.Dashboard) {
                this.store.moreList()
                    .then((res) => {
                    if (res == 'success') {
                        this.groupStore.getGroupList(this.store.puid);
                        this.store.getRegionEndpoint();
                        this.store.get_stratum_url();
                        this.store.getEarnStats();
                        this.store.getWorkStats();
                        this.store.getWorkerShareHistory(this.dimension);
                        this.store.getNetworkStatus();
                    }
                    else if (res == 'nolist') {
                        this.props.navigation.navigate('Create');
                    }
                });
            }
        };
        this.store = this.props.store.dashboard;
        this.appStore = this.props.store.appStore;
        this.groupStore = this.props.store.miner;
        this.authStore = this.props.store.auth;
        this.noticeContent = '';
        this.display = false;
        this.dimension = "1h";
        reaction(() => this.appStore.isConnected, isConnected => this.httpList());
        reaction(() => this.appStore.selectedTab, selectedTab => this.httpList());
    }
    componentWillMount() {
        this.httpList();
    }
    authDispaly() {
        this.display = false;
    }
    render() {
        const { account, stratum_url, loading, earnStats, workStats, shareHistory, coinType, networkStatus, regionEndpoint } = this.store;
        const { groupList, minerLoading } = this.groupStore;
        const navConfig = {
            leftContent: {
                type: navType.empty,
            },
            title: {
                type: navType.text,
                text: account.name ? account.name + '@' + account.coin_type + '-' + account.region_text : '-'
            },
            rightContent: {
                type: navType.text,
                text: 'Switch'
            }
        };
        return (React.createElement(View, { style: styles.container },
            React.createElement(ActivityIndicator, { text: I18n.t('loading'), toast: true, animating: loading }),
            React.createElement(Notice, { content: this.noticeContent, display: this.display, authDispaly: () => this.authDispaly() }),
            React.createElement(View, { style: styles.tabNav },
                React.createElement(NavBar, { title: navConfig.title, leftContent: navConfig.leftContent, rightContent: navConfig.rightContent, handleClick: (type) => type == 'right' ? this.props.navigation.navigate('SubAccount', {
                        linkByDashboard: true,
                    }) : null })),
            React.createElement(ScrollView, { style: styles.box, bounces: false, showsVerticalScrollIndicator: false },
                React.createElement(MinepoolInfo, { earnStats: earnStats, workStats: workStats, account: account, onToast: (v) => this._onToast(v) }),
                React.createElement(Flex, { direction: "column", align: "end", style: styles.Segmented },
                    React.createElement(SegmentedControl, { values: [I18n.t('hours'), I18n.t('days')], tintColor: '#f7ca18', style: styles.SegmentedControl, onChange: this.onChange }),
                    React.createElement(Flex, { direction: "column", align: "end", style: styles.hashView },
                        React.createElement(HashrateCharts, { shareHistory: shareHistory, lineColor: "#999999", dimension: this.dimension }))),
                React.createElement(View, { style: styles.caption },
                    React.createElement(Text, { style: styles.caption_text }, I18n.t('group_manager')),
                    React.createElement(Text, { style: styles.caption_more, onPress: () => this.props.navigation.navigate("GroupList") },
                        " ",
                        I18n.t('more'))),
                React.createElement(Group, { group: groupList, loading: minerLoading, changeTab: gid => this.changeTab(gid) }),
                React.createElement(WhiteSpace, null),
                React.createElement(AccountIncome, { earnStats: earnStats, handleTab: (v) => this.appStore.onChangeTab(v), coinType: coinType }),
                React.createElement(PoolAddress, { name: account.name, stratum_url: stratum_url, handleLink: () => this._onHanleLink(regionEndpoint) }),
                networkStatus ?
                    React.createElement(NetworkInfo, { networkStatus: networkStatus, coinType: coinType }) : null,
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(Flex, { direction: "column", align: "center", justify: "center" },
                    React.createElement(Button, { type: "primary", style: styles.button, onPressOut: () => this.props.navigation.navigate('PoolStats') },
                        React.createElement(Text, null, I18n.t('view_pool_status'))),
                    React.createElement(WhiteSpace, { size: "lg" })),
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(WhiteSpace, { size: "xl" }))));
    }
};
__decorate([
    observable
], Dashboard.prototype, "noticeContent", void 0);
__decorate([
    observable
], Dashboard.prototype, "display", void 0);
__decorate([
    observable
], Dashboard.prototype, "dimension", void 0);
Dashboard = __decorate([
    inject('store'),
    observer
], Dashboard);
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
    },
    box: {
        width: '100%',
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
        marginBottom: 0,
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
    },
    caption_text: {
        fontWeight: 'bold',
        color: '#999999',
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },
    caption_more: {
        color: '#2194ed',
        position: 'absolute',
        right: 0,
        height: '100%',
        padding: adapt.pxToDp(15),
        textAlign: 'right',
        fontSize: adapt.setSpText(15)
    },
    button: {
        height: adapt.pxToDp(41),
        width: '80%',
        backgroundColor: '#22A7F0',
    },
    buttonCore: {
        // width:'80%',
        fontSize: adapt.setSpText(16),
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2194ed',
        // margin:'5% 10%',
        color: '#ffffff',
        // borderBottomLeftRadius:10,
        // borderBottomRightRadius:10,
        borderRadius: 30,
        borderColor: '#2194ed',
    },
});
export default withNavigation(Dashboard);
//# sourceMappingURL=Dashboard.js.map