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
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import adapt from "../interfaces/adapt";
import { List } from 'antd-mobile-rn';
import { AsyncStorage } from "react-native";
import { storage } from "../interfaces/storage";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { NavBar } from '../components/NavBar';
import { navType } from "../interfaces/navType";
const Item = List.Item;
const Brief = Item.Brief;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.navConfig = {
            leftContent: {
                type: navType.text,
                text: 'Back'
            },
            title: {
                type: navType.text,
                text: 'Debug'
            },
            rightContent: {
                type: navType.empty,
            }
        };
        this.logs = [];
        this.store = this.props.store.auth;
    }
    componentWillMount() {
        this.getLog();
    }
    updateShake() {
        this.store.updateShake(false);
    }
    getLog() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield AsyncStorage.getItem(storage.ERROR_LOG);
            this.logs = req ? JSON.parse(req) : [];
        });
    }
    render() {
        return (React.createElement(View, { style: styles.container },
            React.createElement(View, { style: styles.top }),
            React.createElement(View, { style: styles.tabNav },
                React.createElement(NavBar, { title: this.navConfig.title, leftContent: this.navConfig.leftContent, rightContent: this.navConfig.rightContent, handleClick: (type) => type == 'left' ? this.updateShake() : null })),
            React.createElement(ScrollView, { style: styles.contentContainer, showsVerticalScrollIndicator: false }, this.logs.map((item, index) => {
                return (React.createElement(View, { style: styles.view, key: index },
                    React.createElement(Text, { style: styles.text }, item)));
            }))));
    }
};
__decorate([
    observable
], App.prototype, "logs", void 0);
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
        backgroundColor: '#ffffff',
        flex: 1,
        width: '100%',
    },
    top: {
        width: '100%',
        backgroundColor: '#22a7f0',
        paddingTop: adapt.isIphonex() ? adapt.pxToDp(40) : adapt.pxToDp(20),
    },
    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
    },
    view: {
        backgroundColor: '#f5f5f5',
        margin: adapt.pxToDp(10),
        padding: adapt.pxToDp(8)
    },
    text: {
        color: '#030303',
        fontSize: adapt.setSpText(14),
    },
});
//# sourceMappingURL=Debug.js.map