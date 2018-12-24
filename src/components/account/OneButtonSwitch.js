var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icons } from '../../components/Icons';
import adapt from '../../interfaces/adapt';
import { NavigationActions, StackActions } from 'react-navigation';
import { Flex, List, WingBlank, WhiteSpace, ActivityIndicator } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { TabNav } from '../../interfaces/tabnav';
const Item = List.Item;
const Brief = Item.Brief;
let OneButtonSwitch = class OneButtonSwitch extends Component {
    constructor(props) {
        super(props);
        this.switchAccount = () => {
            const { current_regionId, current_puid, current_mode } = this.props.navigation.state.params;
            this.store.switchAccount(current_regionId, current_puid, current_mode)
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
        this.handleSwitchCoin = (item) => {
            this.store.changeSwitchCoin(item);
        };
        this.store = this.props.store.modifyAccount;
        this.appStore = this.props.store.appStore;
        this.dashboard = this.props.store.dashboard;
    }
    componentDidMount() {
        this.props.navigation.setParams({ switchAccount: this.switchAccount });
    }
    render() {
        const { current_mode, support_coins } = this.props.navigation.state.params;
        const { destCoin, loading } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(ActivityIndicator, { text: "\u6B63\u5728\u52A0\u8F7D...", toast: true, animating: loading }),
            React.createElement(WhiteSpace, null),
            React.createElement(WingBlank, null,
                React.createElement(Text, { style: { color: '#8E8E93', fontSize: adapt.setSpText(13) } }, "Warning: Due to the special difficulty adjustment rule and currency fluctuation of Bitcoin Cash\uFF0Cplease use this function carefully\uFF01")),
            React.createElement(WhiteSpace, null),
            React.createElement(List, null, support_coins.map(item => {
                return (item != current_mode ?
                    React.createElement(Item, { key: item, extra: destCoin == item ?
                            React.createElement(Icons, { iconName: "img_main_select", width: "12", height: "9" }) : null, onClick: () => {
                            this.handleSwitchCoin(item);
                        } }, item.toUpperCase()) : null);
            })),
            React.createElement(WhiteSpace, null)));
    }
};
OneButtonSwitch.navigationOptions = ({ navigation }) => ({
    headerTitle: 'One-button switch',
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.switchAccount() },
        React.createElement(Flex, { direction: "row", style: { marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3) } },
            React.createElement(Text, { style: { color: '#ffffff' } }, "Save")))),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
OneButtonSwitch = __decorate([
    inject('store'),
    observer
], OneButtonSwitch);
export default OneButtonSwitch;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
});
//# sourceMappingURL=OneButtonSwitch.js.map