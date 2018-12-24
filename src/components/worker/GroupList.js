var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TabNav } from '../../interfaces/tabnav';
import { Icons } from '../../components/Icons';
import { Flex, ActivityIndicator, List, SwipeAction, Modal, Toast } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import { inject, observer } from "mobx-react";
import { compare } from "../../interfaces/utils";
import loadingStyle from 'antd-mobile-rn/lib/activity-indicator/style/index.native';
const Item = List.Item;
const Brief = Item.Brief;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.addGroup = () => {
            Modal.prompt('创建新分组', '请为此分组输入名称', (text) => {
                this.store.operateGroup('create', { group_name: text.trim() });
            }, 'default', '', ['名称']);
        };
        this.changeTab = (v) => {
            this.store.gid = v;
            this.appStore.onChangeTab(TabNav.Miner);
            this.props.navigation.goBack();
            this.store.getWorkerList({
                status: "active",
                group: v,
                page: 1,
                page_size: 20,
                filter: '',
                order_by: "worker_name",
                asc: 0
            });
        };
        this.store = this.props.store.miner;
        this.appStore = this.props.store.appStore;
    }
    componentWillMount() {
        this.store.getGroupList();
    }
    componentDidMount() {
        this.props.navigation.setParams({ addGroup: this.addGroup });
    }
    render() {
        const { groupList, minerLoading } = this.store;
        const { navigation } = this.props;
        const right = (item) => {
            return [
                {
                    text: '重命名',
                    onPress: () => {
                        console.log(item.gid);
                        Modal.prompt(`将${item.name} 重命名为`, '请为此分组输入名称', (text) => {
                            if (item.name.trim() == text.trim()) {
                                Toast.info('提交成功!', 1);
                                return;
                            }
                            this.store.operateGroup('update/' + item.gid, { group_name: text.trim() });
                        }, 'default', '', ['名称']);
                    },
                    style: { backgroundColor: '#C7C7CC', color: '#ffffff' },
                },
                {
                    text: '删除',
                    onPress: () => {
                        Modal.alert('删除分组', `${item.name} 分组将被移除，该分组下所有子账户将会被移入 "未分组"`, [
                            {
                                text: '取消', onPress: () => {
                                }, style: { color: '#C7C7CC' }
                            },
                            {
                                text: '确定', onPress: () => {
                                    this.store.operateGroup('delete/' + item.gid, {});
                                }
                            },
                        ]);
                    },
                    style: { backgroundColor: '#FF3B30', color: '#ffffff' },
                },
            ];
        };
        return (React.createElement(ScrollView, { style: styles.contentContainer, showsVerticalScrollIndicator: false }, minerLoading ?
            React.createElement(ActivityIndicator, { text: "\u6B63\u5728\u52A0\u8F7D...", animating: minerLoading, styles: _loadingStyle })
            :
                React.createElement(List, null, groupList.sort(compare("gid")).map((item, index) => {
                    return (React.createElement(SwipeAction, { disabled: item.gid == -1 || item.gid == 0 ? true : false, autoClose: true, key: item.gid, style: { backgroundColor: 'transparent' }, right: right(item) },
                        React.createElement(Item, { arrow: "horizontal", onClick: () => this.changeTab(item.gid) },
                            React.createElement(Brief, { style: {
                                    fontSize: adapt.setSpText(14),
                                    color: "#6D6D72"
                                } }, item.name == 'DEFAULT' ? '未分组' : item.name),
                            React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: {
                                    paddingTop: adapt.pxToDp(9),
                                    paddingBottom: adapt.pxToDp(4)
                                } },
                                React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: { width: adapt.pxToDp(135) } },
                                    React.createElement(Text, { style: styles.text }, item.shares_15m),
                                    React.createElement(Brief, { style: styles.unit },
                                        item.shares_unit,
                                        "H/s")),
                                React.createElement(Flex, { direction: "row", justify: "start", align: "center" },
                                    React.createElement(Text, { style: styles.text },
                                        item.workers_active,
                                        "/",
                                        item.workers_total),
                                    React.createElement(Brief, { style: styles.unit }, "Miners"))))));
                }))));
    }
};
App.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Groups',
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.addGroup() },
        React.createElement(Flex, { direction: "row", style: { marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3) } },
            React.createElement(Icons, { iconName: "icon_header_add", width: "16", height: "16" })))),
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
App = __decorate([
    inject('store'),
    observer
], App);
export default App;
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#ffffff',
        flex: 1,
        width: '100%',
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
const _loadingStyle = Object.assign({}, loadingStyle, { spinner: Object.assign({}, loadingStyle.spinner, { height: adapt.pxToDp(50), backgroundColor: '#ffffff' }) });
//# sourceMappingURL=GroupList.js.map