var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flex } from 'antd-mobile-rn';
import adapt from '../interfaces/adapt';
import { inject, observer } from "mobx-react";
import { Icons } from './Icons';
import I18n from "../interfaces/i18n";
let CoinList = class CoinList extends Component {
    constructor(props) {
        super(props);
        this.handleChangeCoin = (coinType) => {
            this.store.handleChangeCoin(coinType);
            this.props.navigation.goBack();
        };
        this.store = this.props.store.welcome;
    }
    render() {
        const { multiCoins, coins_pic } = this.props.navigation.state.params;
        return (React.createElement(View, { style: styles.container }, Object.keys(multiCoins).map(item => {
            return (React.createElement(View, { style: styles.items, key: item },
                React.createElement(Flex, { align: "center", justify: "center", direction: "column", onPress: () => this.handleChangeCoin(item), style: { width: '100%' } },
                    React.createElement(View, { style: styles.rip },
                        React.createElement(Icons, { uri: item in coins_pic ? coins_pic[item] : '', width: "30", height: "30" })),
                    React.createElement(Text, { style: styles.text }, item.toUpperCase()))));
        })));
    }
};
CoinList.navigationOptions = {
    headerTitle: I18n.t('coins'),
    headerStyle: {
        backgroundColor: '#22A7F0',
        borderBottomWidth: 0,
        height: adapt.pxToDp(44)
    }
};
CoinList = __decorate([
    inject('store'),
    observer
], CoinList);
export default CoinList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: "wrap",
    },
    items: {
        width: '33%',
        height: adapt.pxToDp(80),
        justifyContent: 'center',
        alignItems: "center",
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.4,
    },
    text: {
        marginTop: adapt.pxToDp(8),
        color: '#000000',
        fontSize: adapt.setSpText(14),
        textAlign: 'center'
    },
    rip: {
        width: adapt.pxToDp(30),
        height: adapt.pxToDp(30),
        borderRadius: adapt.pxToDp(15),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
//# sourceMappingURL=CoinList.js.map