var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import adapt from '../../interfaces/adapt';
import { List, WhiteSpace, Flex, InputItem, Button } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal';
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';
const Item = List.Item;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.addContact = () => {
            const { regionId, puid, item } = this.props.navigation.state.params;
            if (!this.store.loading) {
                let operate = item ? 'update' : 'create';
                this.store.setAlertContact(regionId, operate, {
                    puid: puid,
                    note: this.note,
                    email: this.email,
                    region_code: this.code,
                    phone: this.phone,
                    id: item ? item.id : null
                }).then(res => {
                    !item && res ? this.props.navigation.goBack() : null;
                });
            }
        };
        this.delete = () => {
            this.deleteLoading = true;
            const { regionId, puid, item } = this.props.navigation.state.params;
            this.store.setAlertContact(regionId, 'delete', {
                puid: puid,
                id: item.id
            }).then(res => {
                this.deleteLoading = false;
                res ? this.props.navigation.goBack() : null;
            });
        };
        this.updateCountryCode = (value) => {
            this.country = value.cca2;
            this.code = value.callingCode;
            this.countryName = value.name;
        };
        const { item } = this.props.navigation.state.params;
        this.store = this.props.store.modifyAccount;
        this.note = item ? item.note : "";
        this.code = item && item.region_code ? item.region_code : '86';
        this.phone = item ? item.phone : '';
        this.email = item ? item.email : '';
        const userCountryData = getAllCountries().filter(country => country.callingCode === this.code).pop();
        this.country = userCountryData.cca2;
        this.countryName = userCountryData.name.common;
        this.deleteLoading = false;
    }
    componentDidMount() {
        this.props.navigation.setParams({ addContact: this.addContact });
    }
    render() {
        const { item } = this.props.navigation.state.params;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, null),
            React.createElement(List, null,
                React.createElement(InputItem, { placeholder: "Contacter", value: this.note, onChange: v => this.note = v }, "Name"),
                React.createElement(Item, { arrow: "horizontal" },
                    React.createElement(CountryPicker, { closeable: true, showCallingCode: true, filterable: true, filterPlaceholder: "Country", filterPlaceholderTextColor: "rgba(0,0,0,0.4)", onChange: (value) => this.updateCountryCode(value), cca2: this.country },
                        React.createElement(Flex, { direction: "row", align: "center" },
                            React.createElement(Text, { style: { fontSize: 17, marginRight: adapt.pxToDp(25) } }, "Country/Region"),
                            React.createElement(Text, { style: { fontSize: 17, color: '#8E8E93' } }, this.countryName)))),
                React.createElement(Item, null,
                    React.createElement(Flex, { direction: "row", align: "center" },
                        React.createElement(Text, { style: { fontSize: 17, flex: 2 } }, "Phone Number"),
                        React.createElement(Text, { style: { fontSize: 17, flex: 1 } }, '+' + this.code),
                        React.createElement(View, { style: { flex: 2 } },
                            React.createElement(TextInput, { placeholder: "Optional", style: { fontSize: adapt.setSpText(17) }, onChangeText: (text) => this.phone = text, value: this.phone, keyboardType: "numeric" })))),
                React.createElement(InputItem, { placeholder: "Optional", value: this.email, onChange: v => this.email = v }, "Email")),
            item ?
                React.createElement(Button, { onPressOut: () => this.delete(), style: styles.submit, styles: _btnStyle, disabled: this.deleteLoading, loading: this.deleteLoading }, "Delete Contact") : null));
    }
};
App.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name,
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.addContact() },
        React.createElement(Flex, { direction: "row", style: { marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3) } },
            React.createElement(Text, { style: { color: '#ffffff' } }, "Save")))),
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
__decorate([
    observable
], App.prototype, "note", void 0);
__decorate([
    observable
], App.prototype, "countryName", void 0);
__decorate([
    observable
], App.prototype, "country", void 0);
__decorate([
    observable
], App.prototype, "code", void 0);
__decorate([
    observable
], App.prototype, "phone", void 0);
__decorate([
    observable
], App.prototype, "email", void 0);
__decorate([
    observable
], App.prototype, "deleteLoading", void 0);
App = __decorate([
    inject('store'),
    observer
], App);
export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
    submit: {
        marginTop: adapt.pxToDp(40),
        backgroundColor: '#FFFFFF',
        width: adapt.screenW(),
        height: adapt.pxToDp(40),
        borderWidth: 0
    },
});
const _btnStyle = Object.assign({}, btnStyle, { defaultRawText: Object.assign({}, btnStyle.defaultRawText, { color: '#FE3824', fontSize: adapt.setSpText(16) }) });
//# sourceMappingURL=OperateContact.js.map