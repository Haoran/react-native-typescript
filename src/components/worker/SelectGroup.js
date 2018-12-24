var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, DeviceEventEmitter } from 'react-native';
import { Flex, Modal, List, Button } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import { compare } from "../../interfaces/utils";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { inject, observer } from "mobx-react";
const Item = List.Item;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = (v) => {
            const { worker_id } = this.props.navigation.state.params;
            DeviceEventEmitter.emit('selected', { worker_id: worker_id.toString(), group_id: v });
            this.props.navigation.goBack();
        };
        this.handleCreate = () => {
            Modal.prompt('创建新分组', '请为此分组输入名称', (text) => {
                this.store.operateGroup('create', { group_name: text });
            }, 'default', '', ['名称']);
        };
        this.store = this.props.store.miner;
    }
    componentWillMount() {
        this.store.getGroupList();
    }
    render() {
        const { worker_id, type } = this.props.navigation.state.params;
        const { groupList, workerList } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: styles.miner }, workerList.map(item => {
                return (item.checked || type ?
                    React.createElement(Button, { size: "small", key: item.worker_id, disabled: true, style: styles.text5 }, item.worker_name) : null);
            })),
            React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: styles.count },
                React.createElement(Text, { style: styles.text6 },
                    worker_id.length,
                    " \u53F0\u77FF\u673A")),
            React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: styles.iconAdd, onPress: () => this.handleCreate() },
                React.createElement(FontAwesomeIcon, { name: "plus-circle", size: 20, color: "#22A7F0" }),
                React.createElement(Text, { style: styles.text4 }, "Create a new group")),
            React.createElement(ScrollView, { style: styles.contentContainer, showsVerticalScrollIndicator: false },
                React.createElement(List, null, groupList.sort(compare("gid")).map(item => {
                    return (item.gid == 0 ? null :
                        React.createElement(Item, { arrow: "horizontal", key: item.gid, onClick: () => this.handleSelect(item.gid) },
                            React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                                React.createElement(Text, { style: styles.text1 }, item.name == 'DEFAULT' ? '未分组' : item.name),
                                React.createElement(Text, { style: styles.text2 },
                                    item.shares_15m,
                                    " ",
                                    item.shares_unit,
                                    "H/s"),
                                React.createElement(Text, { style: styles.text3 },
                                    item.workers_active,
                                    "/",
                                    item.workers_total))));
                })))));
    }
};
App.navigationOptions = {
    headerTitle: '选择分组',
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
};
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
        backgroundColor: '#ffffff',
        width: '100%',
    },
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 1,
        width: '100%',
    },
    text1: {
        width: '35%',
        color: '#666666',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    text2: {
        width: '35%',
        color: '#666666',
        textAlign: 'right',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    text3: {
        width: '30%',
        color: '#666666',
        textAlign: 'right',
        paddingRight: adapt.pxToDp(10),
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    text4: {
        fontSize: adapt.setSpText(14),
        color: '#22A7F0',
        marginLeft: adapt.pxToDp(15),
        height: adapt.pxToDp(45),
        lineHeight: adapt.pxToDp(45),
    },
    unit: {
        color: '#868686',
        fontSize: adapt.setSpText(14),
        paddingTop: 0,
        marginLeft: adapt.pxToDp(3)
    },
    iconAdd: {
        paddingLeft: adapt.pxToDp(15),
        width: '100%',
        backgroundColor: '#F7F7F7',
    },
    miner: {
        width: '100%',
        padding: adapt.pxToDp(15),
        backgroundColor: '#F7F7F7',
    },
    count: {
        width: '100%',
        paddingLeft: adapt.pxToDp(15),
        paddingBottom: adapt.pxToDp(8),
        backgroundColor: '#F7F7F7',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 0.5
    },
    text5: {
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: adapt.pxToDp(10),
        height: adapt.pxToDp(28),
    },
    text6: {
        color: '#000000',
        fontSize: adapt.setSpText(12),
    }
});
//# sourceMappingURL=SelectGroup.js.map