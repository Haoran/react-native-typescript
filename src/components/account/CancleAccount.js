var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { StyleSheet, ScrollView, } from 'react-native';
import { List, WhiteSpace, Switch } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import adapt from "../../interfaces/adapt";
import { observable } from "mobx";
import { DeviceEventEmitter } from 'react-native';
const Item = List.Item;
let Setting = class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.onSwitchChange = (v, regionID, puid) => {
            this.isHidden = v;
            this.store.hideAccount(regionID, 'cancle', puid).then(res => {
                if (res) {
                    DeviceEventEmitter.emit('onHiddenRefresh');
                    this.props.navigation.goBack();
                }
                else {
                    this.isHidden = true;
                }
            });
        };
        this.store = this.props.store.modifyAccount;
        this.appStore = this.props.store.appStore;
        this.isHidden = this.props.navigation.state.params.account.is_hidden == 0 ? false : true;
    }
    render() {
        const { account } = this.props.navigation.state.params;
        return (React.createElement(ScrollView, { style: styles.contentContainer, showsHorizontalScrollIndicator: false },
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(Item, { extra: React.createElement(Switch, { checked: this.isHidden, onChange: v => this.onSwitchChange(v, account.region_id, account.puid) }) }, "Hide")));
    }
};
Setting.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.account.name + '@' + navigation.state.params.account.coin_type + '-' + navigation.state.params.account.region_text,
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
__decorate([
    observable
], Setting.prototype, "isHidden", void 0);
Setting = __decorate([
    inject('store'),
    observer
], Setting);
export default Setting;
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
    }
});
//# sourceMappingURL=CancleAccount.js.map