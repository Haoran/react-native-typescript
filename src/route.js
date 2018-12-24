var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { createStackNavigator } from "react-navigation";
import { inject, observer } from "mobx-react";
import { View, Platform, StyleSheet, } from 'react-native';
import RNShakeEvent from 'react-native-shake-event';
import I18n from "./interfaces/i18n";
import InitPage from './pages/InitPage';
import TabNav from './pages/TabNav';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import CoinList from './components/CoinList';
import SubAccount from './pages/SubAccount';
import Create from './pages/CreateAccount';
import HidSubAccount from './components/HidSubAccount';
import Setting from './components/account/Setting';
import ModifyAddress from './components/account/ModifyAddress';
import OneButtonSwitch from './components/account/OneButtonSwitch';
import AlertSettingHashrate from './components/account/AlertSettingHashrate';
import AlertSettingMiner from './components/account/AlertSettingMiner';
import AlertContact from './components/account/AlertContact';
import OperateContact from './components/account/OperateContact';
import Watchers from './components/account/Watchers';
import CreateWatcher from './components/account/CreateWatcher';
import OperateWatcher from './components/account/OperateWatcher';
import Earning from './pages/Earning';
import WebviewPage from './components/WebviewPage';
import CancleAccount from './components/account/CancleAccount';
import GroupList from './components/worker/GroupList';
import PoolStats from './components/PoolStats';
import SingleMiner from './components/worker/SingleMiner';
import SelectGroup from './components/worker/SelectGroup';
import Debug from './pages/Debug';
import NetworkStatusProvider from './components/NetworkStatusProvider';
import Language from './components/Language';
const RouteConfigs = {
    TabNav: { screen: TabNav },
    Welcome: { screen: Welcome },
    Login: { screen: Login },
    CoinList: { screen: CoinList },
    SubAccount: { screen: SubAccount },
    Create: { screen: Create },
    HidSubAccount: { screen: HidSubAccount },
    Setting: { screen: Setting },
    ModifyAddress: { screen: ModifyAddress },
    OneButtonSwitch: { screen: OneButtonSwitch },
    AlertSettingHashrate: { screen: AlertSettingHashrate },
    AlertSettingMiner: { screen: AlertSettingMiner },
    AlertContact: { screen: AlertContact },
    OperateContact: { screen: OperateContact },
    Watchers: { screen: Watchers },
    CreateWatcher: { screen: CreateWatcher },
    OperateWatcher: { screen: OperateWatcher },
    Earning: { screen: Earning },
    WebviewPage: { screen: WebviewPage },
    CancleAccount: { screen: CancleAccount },
    InitPage: { screen: InitPage },
    GroupList: { screen: GroupList },
    PoolStats: { screen: PoolStats },
    SingleMiner: { screen: SingleMiner },
    SelectGroup: { screen: SelectGroup },
    Language: { screen: Language },
};
const StackNavigatorConfig = {
    initialRouteName: 'Welcome',
    navigationOptions: {
        headerTitle: '',
        headerTitleStyle: {
            fontSize: 17,
            color: '#ffffff',
            fontWeight: 'bold',
        },
        headerTintColor: '#ffffff',
        headerBackTitle: null,
        headerStyle: {
            height: 0,
            backgroundColor: '#22a7f0',
            borderBottomWidth: 0,
        },
    },
    mode: Platform.OS === 'ios' ? 'modal' : 'card'
};
let Route = class Route extends React.Component {
    // public _isMounted: any;
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            RNShakeEvent.addEventListener('shake', () => {
                this.store.updateShake(true);
            });
        };
        this.store = this.props.store.auth;
        this.appStore = this.props.store.appStore;
    }
    componentWillMount() {
        this.store.getAuthToken();
    }
    componentWillUpdate() {
        I18n.setLanguage(this.appStore.lang);
    }
    componentWillUnmount() {
        RNShakeEvent.removeEventListener('shake');
    }
    render() {
        const { isLogin, shake } = this.store;
        const { lang } = this.appStore;
        switch (isLogin) {
            case 'init':
                StackNavigatorConfig.initialRouteName = 'InitPage';
                break;
            case true:
                StackNavigatorConfig.initialRouteName = 'TabNav';
                break;
            default:
                StackNavigatorConfig.initialRouteName = "Welcome";
                break;
        }
        // StackNavigatorConfig.initialRouteName = 'Language'
        const RootNavigator = createStackNavigator(RouteConfigs, StackNavigatorConfig);
        return (React.createElement(View, { style: { width: '100%', height: '100%' } },
            React.createElement(NetworkStatusProvider, null, shake ?
                React.createElement(Debug, null) :
                React.createElement(RootNavigator, { style: styles.container }))));
    }
};
Route = __decorate([
    inject('store'),
    observer
], Route);
export default Route;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});
//# sourceMappingURL=route.js.map