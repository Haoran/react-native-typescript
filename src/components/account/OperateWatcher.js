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
import { Clipboard, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Icons } from '../../components/Icons';
import adapt from '../../interfaces/adapt';
import { List, WhiteSpace, Flex, Button, Toast } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';
const Item = List.Item;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.delete = () => {
            const { item } = this.props.navigation.state.params;
            this.store.operateWatcher('delete', {
                puid: item.puid,
                watcher_id: item.id
            }).then(res => {
                res ? this.props.navigation.goBack() : null;
            });
        };
        this._setClipboardContent = (v) => __awaiter(this, void 0, void 0, function* () {
            Clipboard.setString(v);
            Toast.info('已复制到剪贴板!', 1);
        });
        const { item } = this.props.navigation.state.params;
        this.store = this.props.store.modifyAccount;
        this.note = item ? item.note : "";
    }
    render() {
        const { item } = this.props.navigation.state.params;
        const { loading } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, null),
            React.createElement(List, null,
                React.createElement(Item, null,
                    React.createElement(Flex, { direction: "row", align: "center" },
                        React.createElement(Text, { style: { fontSize: 17, marginRight: adapt.pxToDp(20) } }, "Name"),
                        React.createElement(Text, { style: { fontSize: 17 } }, item.note))),
                React.createElement(Item, { extra: React.createElement(TouchableOpacity, { onPress: () => this._setClipboardContent(item.redirect) },
                        React.createElement(Icons, { iconName: "copy", width: "20", height: "20" })) },
                    React.createElement(Flex, { direction: "row", align: "center" },
                        React.createElement(Text, { style: { fontSize: 17, marginRight: adapt.pxToDp(20) } }, "Link"),
                        React.createElement(Text, { style: { fontSize: 13, color: '#C7C7CD' } }, item.redirect)))),
            React.createElement(WhiteSpace, { size: "xl" }),
            React.createElement(WhiteSpace, null),
            React.createElement(Flex, { direction: "row", align: "center", justify: "center" },
                React.createElement(QRCode, { value: item.redirect, size: 150 })),
            React.createElement(WhiteSpace, null),
            React.createElement(Button, { onPressOut: () => this.delete(), style: styles.submit, styles: _btnStyle, disabled: loading, loading: loading }, "Delete Link")));
    }
};
App.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name,
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
__decorate([
    observable
], App.prototype, "note", void 0);
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
    }
});
const _btnStyle = Object.assign({}, btnStyle, { defaultRawText: Object.assign({}, btnStyle.defaultRawText, { color: '#FE3824', fontSize: adapt.setSpText(16) }) });
//# sourceMappingURL=OperateWatcher.js.map