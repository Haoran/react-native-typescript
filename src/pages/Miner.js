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
import { StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity, DeviceEventEmitter, Keyboard } from 'react-native';
import { Icons } from '../components/Icons';
import { Toast } from "antd-mobile-rn";
import { Flex, SearchBar, Modal, ActivityIndicator, Tabs } from 'antd-mobile-rn';
import { NavBar } from '../components/NavBar';
import { inject, observer } from "mobx-react";
import adapt from "../interfaces/adapt";
import { navType } from "../interfaces/navType";
import searchStyle from 'antd-mobile-rn/lib/search-bar/style/index.native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { GroupListDrop } from '../components/worker/GroupListDrop';
import { SortListDrop } from '../components/worker/SortListDrop';
import { NoMiner } from '../components/worker/NoMiner';
import { Operate } from '../components/worker/Operate';
import { WorkerTabs } from '../components/worker/WorkerTabs';
import { observable, reaction } from "mobx";
import { withNavigation } from 'react-navigation';
import { TabNav } from "../interfaces/tabnav";
import I18n from "../interfaces/i18n";
const tabs = [
    { title: '活跃(0)' },
    { title: '不活跃(0)' },
    { title: '失效(0)' },
    { title: '全部(0)' },
];
let Miner = class Miner extends Component {
    constructor(props) {
        super(props);
        this.createGroup = () => {
            Modal.prompt(I18n.t("select_creat_group"), I18n.t("group_manager_input_name"), (text) => {
                this.groupShow = false;
                this.store.operateGroup('create', { group_name: text });
            }, 'default', '', [I18n.t("group_manager_name")]);
        };
        this.updateGroupList = () => {
            this.groupShow = true;
            this.store.getGroupList();
        };
        this.handleGroup = (v) => {
            if (v == 'hidden') {
                this.groupShow = false;
            }
            else {
                this.groupShow = false;
                this.store.gid = v;
                this.httpWorkerList();
            }
        };
        this.handleSort = (v) => {
            if (v == 'hidden') {
                this.sortShow = false;
            }
            else {
                this.sortKey = v.key;
                this.asc = v.asc;
                this.httpWorkerList();
                setTimeout(() => this.sortShow = false, 400);
            }
        };
        this.handleOperate = (v) => {
            if (v == 'hidden') {
                this.operate = false;
            }
            else {
                const checkedIDs = [], allIDs = [];
                let ableDelete = true;
                this.store.workerList.map(item => {
                    allIDs.push(item.worker_id);
                    item.checked ? checkedIDs.push(item.worker_id) : null;
                    item.status == 'ACTIVE' && item.checked ? ableDelete = false : null;
                });
                switch (v) {
                    // 移动至...
                    case '0':
                        if (checkedIDs.length == 0) {
                            Toast.info('请勾选矿机!', 1);
                            return;
                        }
                        this.props.navigation.navigate('SelectGroup', { worker_id: checkedIDs });
                        break;
                    // 删除
                    case '1':
                        if (checkedIDs.length == 0) {
                            Toast.info('请勾选矿机!', 1);
                            return;
                        }
                        if (!ableDelete) {
                            Toast.info('不能删除活跃矿机 !', 1);
                            return;
                        }
                        this.httpOperateWorker({ worker_id: checkedIDs.toString(), group_id: 0 });
                        break;
                    // 移动全部
                    case '2':
                        this.props.navigation.navigate('SelectGroup', { worker_id: allIDs, type: 'all' });
                        break;
                    // 删除全部
                    default:
                        if (!ableDelete) {
                            Toast.info('不能删除活跃矿机 !', 1);
                            return;
                        }
                        this.httpOperateWorker({ worker_id: allIDs.toString(), group_id: 0 });
                        break;
                }
                this.operate = false;
            }
        };
        this._tabOnchange = (index) => {
            const tabIndex = ['active', 'inactive', 'dead', 'all'];
            this.status = tabIndex[index];
            this.httpWorkerList();
        };
        this.httpOperateWorker = (params) => __awaiter(this, void 0, void 0, function* () {
            this.store.operateWorker(params).then(() => {
                this.batch = false;
                this.store.workerList.map(item => item.checked = false);
                this.store.getGroupList();
                this.httpWorkerList();
            });
        });
        this.changeBatch = (id) => {
            this.store.workerList.map(item => {
                if (item.worker_id == id) {
                    item.checked ? item.checked = false : item.checked = true;
                }
            });
            this.store.workerList = [...[], ...this.store.workerList];
        };
        this.httpWorkerList = (page = 1) => __awaiter(this, void 0, void 0, function* () {
            this.page = page;
            this.store.getWorkerList({
                status: this.status,
                group: this.store.gid,
                page: page,
                page_size: 20,
                filter: this.filter,
                order_by: this.sortKey,
                asc: this.asc
            }).then(() => {
                this.refreshing = false;
            });
        });
        this.store = this.props.store.miner;
        this.dashStore = this.props.store.dashboard;
        this.appStore = this.props.store.appStore;
        this.groupShow = false;
        this.sortShow = false;
        this.refreshing = false;
        this.operate = false;
        this.batch = false;
        this.sortKey = "worker_name";
        this.asc = 0;
        this.page = 1;
        this.status = "active";
        this.filter = "";
        reaction(() => this.appStore.isConnected, isConnected => this.httpList());
        reaction(() => this.appStore.selectedTab, selectedTab => this.httpList());
    }
    componentWillMount() {
        this.httpList();
    }
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('selected', (params) => {
            this.httpOperateWorker(params);
        });
    }
    httpList() {
        if (this.appStore.selectedTab == TabNav.Miner) {
            this.store.getGroupList();
            this.httpWorkerList();
        }
    }
    _onRefresh() {
        this.refreshing = true;
        this.httpWorkerList();
        this.store.getGroupList();
    }
    _onEndReached() {
        if (this.page == 1 && this.store.workerList.length >= 20) {
            this.page++;
            this.httpWorkerList(this.page);
        }
    }
    render() {
        const { groupList, workerList, showFooter, gid } = this.store;
        const { account, stratum_url } = this.dashStore;
        const group = groupList.filter(item => item.gid == gid);
        const noMiner = group.length > 0 && group[0].workers_active + group[0].workers_inactive + group[0].workers_dead == 0 ? true : false;
        const navConfig = {
            leftContent: {
                type: noMiner ? navType.empty : navType.text,
                text: (React.createElement(Text, { style: styles.text, onPress: () => {
                        this.batch = this.batch ? false : true;
                        this.operate = false;
                    } }, this.batch ? I18n.t("select_group_cancel") : I18n.t("select_miner"))),
            },
            title: {
                type: navType.element,
                element: (React.createElement(Flex, { direction: "row", justify: "center", align: "center", onPress: () => this.updateGroupList() },
                    React.createElement(Text, { style: styles.title }, group.length > 0 ? group[0].name == 'DEFAULT' ? I18n.t('default') : group[0].name : null),
                    React.createElement(FontAwesomeIcon, { name: "caret-down", size: 16, color: "#fff", style: styles.iconDrop })))
            },
            rightContent: {
                type: noMiner ? navType.empty : navType.element,
                element: (React.createElement(Flex, { direction: "row", justify: "center", align: "center" }, this.batch ?
                    React.createElement(Text, { style: styles.text, onPress: () => this.operate = true }, I18n.t("group_manager_operate")) :
                    React.createElement(Text, { style: styles.text, onPress: () => this.sortShow = true }, I18n.t("group_manager_sort"))))
            }
        };
        return (React.createElement(View, { style: styles.container },
            this.operate ? React.createElement(Operate, { handleOperate: (v) => this.handleOperate(v) }) : null,
            this.groupShow ?
                React.createElement(GroupListDrop, { list: groupList, handleCreate: () => this.createGroup(), handleGroup: (v) => this.handleGroup(v) }) : null,
            this.sortShow ?
                React.createElement(SortListDrop, { sortKey: this.sortKey, asc: this.asc, handleSort: (v) => this.handleSort(v) }) : null,
            React.createElement(View, { style: styles.tabNav },
                React.createElement(NavBar, { title: navConfig.title, leftContent: navConfig.leftContent, rightContent: navConfig.rightContent, handleClick: () => null })),
            noMiner ?
                React.createElement(NoMiner, { name: account.name, poolAddress: stratum_url })
                :
                    React.createElement(Flex, { direction: "column" },
                        React.createElement(SearchBar, { placeholder: "Search", style: styles.search, styles: _searchStyle, value: this.filter, onCancel: () => Keyboard.dismiss(), onChange: (v) => this.filter = v, onSubmit: () => this.httpWorkerList() }),
                        React.createElement(View, { style: { flex: 1 } },
                            React.createElement(Tabs, { tabs: tabs, initialPage: 0, tabBarPosition: "top", onChange: (tab, index) => this._tabOnchange(index), renderTabBar: (TabBarPropsType) => WorkerTabs(TabBarPropsType, group) },
                                React.createElement(FlatList, { showsVerticalScrollIndicator: true, style: { width: '100%' }, data: workerList, keyExtractor: item => item.worker_id.toString(), onEndReached: () => this._onEndReached(), onEndReachedThreshold: 0.1, ListHeaderComponent: React.createElement(View, { style: styles.separator },
                                        this.batch ? React.createElement(Flex, { style: { width: adapt.pxToDp(30) } }) : null,
                                        React.createElement(Flex, { align: "start", justify: "end", direction: "row", style: { flex: 5 } },
                                            React.createElement(Text, { style: styles.text1 }, I18n.t("miner_cell_hashrate")),
                                            React.createElement(Text, { style: [styles.text1, { textAlign: 'center' }] }, I18n.t("miner_cell_24H_hashrate")),
                                            React.createElement(Text, { style: [styles.text1, { textAlign: 'right' }] }, I18n.t("miner_top_view_list_rejected"))),
                                        React.createElement(Flex, { align: "start", justify: "end", style: styles.rightIcon })), ListFooterComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(50) } }, showFooter == 0 ?
                                        React.createElement(Text, null) :
                                        showFooter == 1 ?
                                            React.createElement(ActivityIndicator, { text: I18n.t("loading"), animating: showFooter == 1 })
                                            :
                                                React.createElement(Text, null, I18n.t("pool_status_no_data"))), ListEmptyComponent: React.createElement(Flex, { justify: "center", align: "center", style: { height: adapt.pxToDp(120) } }, showFooter == 0 ? React.createElement(Text, null, I18n.t("miner_no_hashrate")) : null), refreshControl: React.createElement(RefreshControl, { refreshing: this.refreshing, onRefresh: () => this._onRefresh(), title: I18n.t("hard_loading"), titleColor: "#666666", progressBackgroundColor: "#ffff00" }), renderItem: ({ item, separators }) => (React.createElement(Flex, { style: styles.list, onPress: () => this.props.navigation.navigate('SingleMiner', {
                                            name: item.worker_name,
                                            id: item.worker_id,
                                        }) },
                                        React.createElement(View, { style: styles.separator },
                                            this.batch ?
                                                React.createElement(TouchableOpacity, { style: { marginRight: adapt.pxToDp(13) }, onPress: () => this.changeBatch(item.worker_id) },
                                                    React.createElement(Icons, { iconName: item.checked ? 'checked' : 'check', width: "15", height: "15" }))
                                                : null,
                                            React.createElement(Flex, { align: "start", justify: "end", direction: "column", style: { flex: 5 } },
                                                React.createElement(Flex, { direction: "row", align: "center", justify: "start" },
                                                    React.createElement(Text, { style: styles.subhead }, item.worker_name),
                                                    React.createElement(View, { style: {
                                                            borderWidth: 3,
                                                            borderColor: colors[item.status],
                                                            marginLeft: 5,
                                                            borderRadius: 10
                                                        } })),
                                                React.createElement(Flex, { align: "start", justify: "end", direction: "row" },
                                                    React.createElement(Text, { style: styles.text2 },
                                                        item.shares_15m,
                                                        " ",
                                                        item.shares_unit,
                                                        "H/s"),
                                                    React.createElement(Text, { style: [styles.text2, { textAlign: 'center' }] },
                                                        item.shares_1d,
                                                        " ",
                                                        item.shares_1d_unit,
                                                        "H/s"),
                                                    React.createElement(Text, { style: [styles.text2, { textAlign: 'right' }] },
                                                        parseFloat(item.reject_percent).toFixed(2),
                                                        "%"))),
                                            React.createElement(Flex, { align: "start", justify: "end", style: styles.rightIcon },
                                                React.createElement(Icons, { iconName: "arrow_right", width: "8", height: "13" }))))) }))))));
    }
};
__decorate([
    observable
], Miner.prototype, "groupShow", void 0);
__decorate([
    observable
], Miner.prototype, "sortShow", void 0);
__decorate([
    observable
], Miner.prototype, "refreshing", void 0);
__decorate([
    observable
], Miner.prototype, "batch", void 0);
__decorate([
    observable
], Miner.prototype, "operate", void 0);
__decorate([
    observable
], Miner.prototype, "sortKey", void 0);
__decorate([
    observable
], Miner.prototype, "asc", void 0);
__decorate([
    observable
], Miner.prototype, "page", void 0);
__decorate([
    observable
], Miner.prototype, "status", void 0);
__decorate([
    observable
], Miner.prototype, "filter", void 0);
Miner = __decorate([
    inject('store'),
    observer
], Miner);
const colors = {
    ACTIVE: '#52C41A',
    INACTIVE: '#F5222D',
    DEAD: '#FAAD14'
};
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
    search: {
        borderRadius: 6,
        height: adapt.pxToDp(32)
    },
    iconDrop: {
        marginLeft: adapt.pxToDp(5),
    },
    title: {
        textAlign: 'center',
        fontSize: adapt.setSpText(17),
        color: "#fff",
        lineHeight: adapt.pxToDp(44),
        fontWeight: 'bold'
    },
    text: {
        textAlign: 'center',
        color: "#fff",
        fontSize: adapt.setSpText(16),
        lineHeight: adapt.pxToDp(44),
        fontWeight: '400'
    },
    separator: {
        paddingBottom: adapt.pxToDp(8),
        paddingRight: adapt.pxToDp(13),
        paddingTop: adapt.pxToDp(8),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(229,229,229,0.5)',
        marginLeft: adapt.pxToDp(15),
        width: '100%'
    },
    list: {
        backgroundColor: '#ffffff',
    },
    text1: {
        flex: 1,
        color: '#666666',
        fontSize: adapt.setSpText(14),
    },
    text2: {
        flex: 1,
        color: '#666666',
        fontSize: adapt.setSpText(13),
        paddingTop: adapt.pxToDp(8),
        fontFamily: "Helvetica Neue",
    },
    subhead: {
        color: '#999999',
        fontSize: adapt.setSpText(15),
    },
    rightIcon: {
        width: adapt.pxToDp(50),
        marginRight: adapt.pxToDp(15)
    },
});
const _searchStyle = Object.assign({}, searchStyle, { wrapper: Object.assign({}, searchStyle.wrapper, { backgroundColor: "#ffffff" }) });
export default withNavigation(Miner);
//# sourceMappingURL=Miner.js.map