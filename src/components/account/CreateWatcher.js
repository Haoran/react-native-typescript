var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import adapt from '../../interfaces/adapt';
import { List, WhiteSpace, Flex, InputItem, Button } from 'antd-mobile-rn';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.addWatcher = () => {
            const { puid } = this.props.navigation.state.params;
            if (!this.store.loading) {
                this.store.operateWatcher('create', {
                    puid: puid,
                    note: this.note,
                }).then(res => {
                    res ? this.props.navigation.goBack() : null;
                });
            }
        };
        this.store = this.props.store.modifyAccount;
        this.note = "";
    }
    componentDidMount() {
        this.props.navigation.setParams({ addWatcher: this.addWatcher });
    }
    render() {
        const { loading } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WhiteSpace, null),
            React.createElement(List, null,
                React.createElement(InputItem, { placeholder: "Set a name", value: this.note, onChange: v => this.note = v }, "Name")),
            React.createElement(Button, { onPressOut: () => this.addWatcher(), style: styles.submit, styles: _btnStyle, disabled: loading, loading: loading }, "Generate a new link")));
    }
};
App.navigationOptions = ({ navigation }) => ({
    headerTitle: "New Watcher",
    headerRight: (React.createElement(TouchableOpacity, { onPress: () => navigation.state.params.addWatcher() },
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
const _btnStyle = Object.assign({}, btnStyle, { defaultRawText: Object.assign({}, btnStyle.defaultRawText, { color: '#22A7F0', fontSize: adapt.setSpText(16) }) });
//# sourceMappingURL=CreateWatcher.js.map