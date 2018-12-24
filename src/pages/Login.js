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
import { AsyncStorage, StyleSheet, View, WebView, } from 'react-native';
import { inject, observer } from "mobx-react";
import { NavigationActions, StackActions } from 'react-navigation';
import adapt from "../interfaces/adapt";
import { TabNav } from '../interfaces/tabnav';
import { storage } from "../interfaces/storage";
import { Toast } from "antd-mobile-rn";
import I18n from "../interfaces/i18n";
let Login = class Login extends Component {
    constructor(props) {
        super(props);
        this.handleMessage = (e) => {
            this.appStore.onChangeTab(TabNav.Dashboard);
            if (e && e.nativeEvent.data) {
                this.handleToken(e.nativeEvent.data);
            }
            else {
                this.props.navigation.goBack();
            }
        };
        this.handleToken = (token) => __awaiter(this, void 0, void 0, function* () {
            // 清除路由历史 并且跳转到dashboard
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TabNav' })]
            });
            const errs = yield AsyncStorage.setItem(storage.AUTH, token);
            if (errs) {
                Toast.info(I18n.t('login_lose_efficacy'), 2);
                this.props.navigation.goBack();
            }
            else {
                console.log(I18n.t('login_sign_up_failure'));
                this.store.setAuthToken(token);
                this.props.navigation.dispatch(resetAction);
            }
        });
        this.store = this.props.store.auth;
        this.appStore = this.props.store.appStore;
    }
    injectJS() {
        const { tokenUrl } = this.store;
        let jsCode = `
            let locationUrl=window.location.href;
            if(locationUrl=='${tokenUrl}'){
                sendData();
                setTimeout(() => {
                    window.location.href='https://i.btc.com/cas/logout';
                },1500)
            }
          
            function sendData() {
                window.postMessage( JSON.stringify(token));
            }
            `;
        return jsCode; // js注入
    }
    render() {
        const { params } = this.props.navigation.state;
        const { login, register } = this.store;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WebView, { scalesPageToFit: true, source: {
                    uri: params.name == 'login' ? login : register,
                    method: 'GET',
                    headers: { 'Cache-Control': 'no-cache' }
                }, style: { width: adapt.screenW(), height: adapt.screenH() }, onMessage: (e) => {
                    this.handleMessage(e);
                }, javaScriptEnabled: true, injectedJavaScript: this.injectJS(), startInLoadingState: true, originWhitelist: ['*'] })));
    }
};
Login.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name == 'login' ? I18n.t('login_sign_in_title') : I18n.t('login_sign_up_title'),
    headerStyle: {
        backgroundColor: '#0288d1',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
Login = __decorate([
    inject('store'),
    observer
], Login);
export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
//# sourceMappingURL=Login.js.map