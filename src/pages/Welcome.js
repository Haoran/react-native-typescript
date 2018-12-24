var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import HashrateCharts from '../components/HashrateCharts';
import adapt from '../interfaces/adapt';
import { inject, observer } from "mobx-react";
import { Flex, WingBlank, WhiteSpace, Button, ActivityIndicator } from 'antd-mobile-rn';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { reaction } from "mobx";
import I18n from "../interfaces/i18n";
let Welcome = class Welcome extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store.welcome;
        this.appStore = this.props.store.appStore;
        reaction(() => this.appStore.isConnected, isConnected => this.httpList());
    }
    componentWillMount() {
        this.httpList();
    }
    httpList() {
        this.store.multiCoinStates().then(res => {
            if (res) {
                this.appStore.getAllUrlConfig();
            }
        });
    }
    toFixed(v, num) {
        return parseFloat(v).toFixed(num);
    }
    render() {
        const { coinType, multiCoins, shareHistory, loading } = this.store;
        const { coins_pic } = this.appStore;
        return (React.createElement(View, { style: styles.container },
            React.createElement(ActivityIndicator, { text: I18n.t("loading"), toast: true, animating: loading }),
            React.createElement(ImageBackground, { style: styles.top, source: require('../assets/img/bg_btcpool_home.png') },
                React.createElement(View, { style: styles.rightContent, onStartShouldSetResponder: () => this.props.navigation.navigate('CoinList', {
                        multiCoins: multiCoins,
                        coins_pic: coins_pic
                    }) },
                    React.createElement(Text, { style: styles.rightNav }, coinType.toUpperCase()),
                    React.createElement(FontAwesomeIcon, { name: "caret-down", size: 16, color: "#fff", style: { width: adapt.pxToDp(20), marginTop: adapt.pxToDp(1) } })),
                React.createElement(Flex, { direction: "column", justify: "start", align: "center", style: { position: 'absolute', top: adapt.height(50) } },
                    React.createElement(Image, { style: styles.logo, source: require('../assets/img/logo_home.png') }),
                    React.createElement(WingBlank, null,
                        React.createElement(Flex, { justify: "center", direction: "row", wrap: "wrap", align: "start", style: { width: '100%' } },
                            React.createElement(Text, { style: styles.status },
                                coinType in multiCoins ? this.toFixed(multiCoins[coinType].stats.shares.shares_15m, 2) : '-',
                                coinType in multiCoins ? '  ' + multiCoins[coinType].stats.shares.shares_unit : '  E',
                                "H/s"),
                            React.createElement(Text, { style: styles.status },
                                coinType in multiCoins ? multiCoins[coinType].stats.workers : '-',
                                " ",
                                I18n.t("piece")),
                            React.createElement(Text, { style: styles.minText }, I18n.t("hashrate")),
                            React.createElement(Text, { style: styles.minText }, I18n.t("miners")))),
                    React.createElement(HashrateCharts, { shareHistory: shareHistory }),
                    React.createElement(WhiteSpace, null))),
            React.createElement(View, { style: styles.bottom },
                React.createElement(WhiteSpace, { size: "xl" }),
                React.createElement(Button, { type: "primary", style: styles.button, onPressOut: () => this.props.navigation.navigate('Login', { name: I18n.t("login_sign_in_title") }) },
                    React.createElement(Text, null, I18n.t("sign_in"))),
                React.createElement(WhiteSpace, { size: "lg" }),
                React.createElement(Button, { style: styles.button1, onPressOut: () => this.props.navigation.navigate('Login', { name: I18n.t("login_sign_up_title") }) },
                    React.createElement(Text, { style: { color: '#22A7F0' } }, I18n.t("sign_up")))),
            React.createElement(Flex, { direction: "row", justify: "start", align: "end", style: styles.link },
                React.createElement(WingBlank, null,
                    React.createElement(Text, { style: { color: '#22A7F0', fontSize: adapt.pxToDp(15) }, onPress: () => this.props.navigation.navigate('WebviewPage', { name: I18n.t("help"), url: 'https://cn-poolapp.api.btc.com/app/help' }) },
                        I18n.t("questions"),
                        "?")))));
    }
};
Welcome.navigationOptions = {
    headerStyle: {
        backgroundColor: '#47d2f9',
        borderBottomWidth: 0,
        height: 0
    }
};
Welcome = __decorate([
    inject('store'),
    observer
], Welcome);
export default Welcome;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    top: {
        flex: 5,
        width: '100%',
        alignItems: 'center'
    },
    bottom: {
        // position: 'absolute',
        // bottom: 60,
        flex: 2,
        width: '100%',
        backgroundColor: '#ffffff',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    link: {
        position: 'absolute',
        bottom: 25,
        width: '100%'
    },
    logo: {
        // marginTop: adapt.pxToDp(55),
        width: adapt.pxToDp(66),
        height: adapt.pxToDp(66)
    },
    rightContent: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: 'center',
        borderColor: '#47d2f9',
        borderTopWidth: 1,
        height: adapt.pxToDp(44),
        marginLeft: adapt.pxToDp(1),
        marginRight: adapt.pxToDp(1),
    },
    rightNav: {
        flex: 0,
        fontSize: adapt.setSpText(16),
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#ffffff',
        marginRight: adapt.pxToDp(5)
    },
    status: {
        width: '50%',
        textAlign: 'center',
        color: '#ffffff',
        fontSize: adapt.setSpText(24),
        marginTop: adapt.pxToDp(40),
        fontWeight: 'bold'
    },
    minText: {
        width: '50%',
        textAlign: 'center',
        color: '#ffffff',
        fontSize: adapt.setSpText(12),
        marginTop: adapt.pxToDp(5),
    },
    button: {
        height: adapt.pxToDp(45),
        width: '80%',
        backgroundColor: '#22A7F0',
    },
    button1: {
        height: adapt.pxToDp(45),
        width: '80%',
    },
});
//# sourceMappingURL=Welcome.js.map