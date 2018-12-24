var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import adapt from '../../interfaces/adapt';
import { Flex, List, WhiteSpace, Switch, Picker, InputItem } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const Item = List.Item;
let Modify = class Modify extends Component {
    constructor(props) {
        super(props);
        this.alertChangeHashrate = () => {
            const { regionId, puid } = this.props.navigation.state.params;
            this.store.setAlertHashrate(regionId, puid, this.hashrate_value, this.hashrate_alert ? 1 : 0, this.hashrate_unit);
        };
        this.onSwitchChange = (value) => {
            this.hashrate_alert = value;
        };
        const { hashrate_alert, hashrate_value, hashrate_unit } = this.props.navigation.state.params;
        this.hashrate_alert = hashrate_alert == 0 ? false : true;
        this.hashrate_value = hashrate_value;
        this.hashrate_unit = hashrate_unit;
        this.units = [
            { label: 'PH/s', value: 'P', },
            { label: 'TH/s', value: 'T', },
            { label: 'GH/s', value: 'G', },
            { label: 'MH/s', value: 'M', },
        ];
        this.store = this.props.store.modifyAccount;
    }
    componentDidMount() {
        this.props.navigation.setParams({ alertChangeHashrate: this.alertChangeHashrate });
    }
    render() {
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(List, null,
                React.createElement(Item, { extra: React.createElement(Switch, { checked: this.hashrate_alert, onChange: this.onSwitchChange }) }, "Enable Active Miner Alert")),
            React.createElement(WhiteSpace, null),
            this.hashrate_alert ?
                React.createElement(List, { renderHeader: () => 'WARN ME WHEN HASHRATE ≤' },
                    React.createElement(InputItem, { type: "number", value: this.hashrate_value.toString(), onChangeText: (v) => this.hashrate_value = v, extra: React.createElement(Picker, { okText: "确定", dismissText: "取消", data: this.units, cols: 1, value: [this.hashrate_unit], onOk: (v) => {
                                this.hashrate_unit = v[0];
                            } },
                            React.createElement(CustomChildren, null)) })) : null));
    }
};
Modify.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Alert Setting',
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.alertChangeHashrate() },
        React.createElement(Flex, { direction: "row", style: { marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3) } },
            React.createElement(Text, { style: { color: '#ffffff' } }, "Save")))),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    }
});
__decorate([
    observable
], Modify.prototype, "hashrate_alert", void 0);
__decorate([
    observable
], Modify.prototype, "units", void 0);
__decorate([
    observable
], Modify.prototype, "hashrate_value", void 0);
__decorate([
    observable
], Modify.prototype, "hashrate_unit", void 0);
Modify = __decorate([
    inject('store'),
    observer
], Modify);
export default Modify;
const CustomChildren = (props) => (React.createElement(TouchableOpacity, { onPress: props.onClick },
    React.createElement(View, { style: { height: adapt.pxToDp(44), flexDirection: 'row', alignItems: 'center' } },
        React.createElement(Text, { style: { color: '#000000', fontSize: adapt.setSpText(17) } }, props.extra),
        React.createElement(FontAwesomeIcon, { name: "caret-down", size: 22, color: "#000000", style: styles.iconDrop }))));
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
    title: {
        flex: 0,
        fontSize: adapt.setSpText(16),
        fontWeight: 'bold',
        color: '#fff'
    },
    iconDrop: {
        marginLeft: adapt.pxToDp(3),
    },
});
//# sourceMappingURL=AlertSettingHashrate.js.map