var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import adapt from '../../interfaces/adapt';
import { Flex, List, WhiteSpace, Switch, InputItem } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
const Item = List.Item;
let Modify = class Modify extends Component {
    constructor(props) {
        super(props);
        this.alertChangeMiner = () => {
            const { regionId, puid } = this.props.navigation.state.params;
            this.store.setAlertMiner(regionId, puid, this.miner_value, this.miner_alert ? 1 : 0);
        };
        this.onSwitchChange = (value) => {
            this.miner_alert = value;
        };
        const { miner_alert, miner_value } = this.props.navigation.state.params;
        this.miner_alert = miner_alert == 0 ? false : true;
        this.miner_value = miner_value;
        this.store = this.props.store.modifyAccount;
    }
    componentDidMount() {
        this.props.navigation.setParams({ alertChangeMiner: this.alertChangeMiner });
    }
    render() {
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(List, null,
                React.createElement(Item, { extra: React.createElement(Switch, { checked: this.miner_alert, onChange: this.onSwitchChange }) }, "Enable Active Miner Alert")),
            React.createElement(WhiteSpace, null),
            this.miner_alert ?
                React.createElement(List, { renderHeader: () => 'WARN ME WHEN MINER ≤' },
                    React.createElement(InputItem, { type: "number", value: this.miner_value.toString(), onChangeText: (v) => this.miner_value = v })) : null));
    }
};
Modify.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Alert Setting',
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.alertChangeMiner() },
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
], Modify.prototype, "miner_alert", void 0);
__decorate([
    observable
], Modify.prototype, "miner_value", void 0);
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
    title: {
        flex: 0,
        fontSize: adapt.setSpText(16),
        fontWeight: 'bold',
        color: '#fff'
    },
});
//# sourceMappingURL=AlertSettingMiner.js.map