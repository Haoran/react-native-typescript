var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import adapt from '../../interfaces/adapt';
import { Icons } from '../../components/Icons';
import { List, WhiteSpace, Flex } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
const Item = List.Item;
let Modify = class Modify extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.modifyAccount;
    }
    componentWillMount() {
        const { puid } = this.props.navigation.state.params;
        this.store.getWatchers(puid);
    }
    render() {
        const { watchers } = this.store;
        const { puid } = this.props.navigation.state.params;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, null),
            React.createElement(List, null, watchers.map(item => {
                return (React.createElement(Item, { arrow: "horizontal", key: item.id, onClick: () => this.props.navigation.navigate('OperateWatcher', {
                        name: item.note,
                        item: item,
                    }) }, item.note));
            })),
            React.createElement(WhiteSpace, null),
            React.createElement(List, null,
                React.createElement(Item, { arrow: "horizontal", onClick: () => this.props.navigation.navigate('CreateWatcher', {
                        puid: puid,
                    }) }, "Add New..."))));
    }
};
Modify.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Share to watcher',
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.navigate('CreateWatcher', {
            puid: navigation.state.params.puid,
        }) },
        React.createElement(Flex, { direction: "row", style: { marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3) } },
            React.createElement(Icons, { iconName: "icon_header_add", width: "16", height: "16" })))),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
Modify = __decorate([
    inject('store'),
    observer
], Modify);
export default Modify;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
});
//# sourceMappingURL=Watchers.js.map