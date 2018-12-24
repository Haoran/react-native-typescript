var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { List } from 'antd-mobile-rn';
import adapt from "../interfaces/adapt";
import { inject, observer } from "mobx-react";
import { Icons } from '../components/Icons';
import { language } from '../interfaces/lang';
import I18n from "../interfaces/i18n";
import { TabNav } from "../interfaces/tabnav";
const Item = List.Item;
const Brief = Item.Brief;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = (item) => {
            this.store.lang = item;
            this.store.selectedTab = TabNav.Dashboard;
        };
        this.store = this.props.store.appStore;
    }
    componentWillMount() {
    }
    render() {
        const { lang } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(List, { style: { width: '100%' } }, Object.keys(language).map(item => {
                return (React.createElement(Item, { key: item, onClick: () => this.handleSelect(item), extra: lang == item ?
                        React.createElement(Icons, { iconName: "img_main_select", width: "12", height: "9" }) : null }, I18n.t(item)));
            }))));
    }
};
App.navigationOptions = {
    headerTitle: '语言设置',
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
        width: '100%',
        backgroundColor: '#EFEFF4',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: "wrap",
        paddingTop: adapt.pxToDp(20)
    },
});
//# sourceMappingURL=language.js.map