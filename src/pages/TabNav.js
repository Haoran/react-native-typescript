var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { TabBar } from 'antd-mobile-rn';
import Miner from './Miner';
import Setting from './Setting';
import Earning from './Earning';
import Dashboard from './Dashboard';
import { inject, observer } from 'mobx-react';
import { TabNav } from '../interfaces/tabnav';
import I18n from "../interfaces/i18n";
let BasicTabBarExample = class BasicTabBarExample extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeTab = (tabName) => {
            this.store.onChangeTab(tabName);
        };
        this.store = this.props.store.appStore;
    }
    render() {
        return (React.createElement(TabBar, { swipeable: true, unselectedTintColor: "rgba(204,204,204,1)", tintColor: "rgba(34,167,240,1)", barTintColor: "#ffffff" },
            React.createElement(TabBar.Item, { title: I18n.t("tabbar_item_dashboard"), icon: require('../assets/img/icon/tab_button_dashboard_normal.png'), selectedIcon: require('../assets/img/icon/tab_button_dashboard_highlight.png'), selected: this.store.selectedTab === TabNav.Dashboard, onPress: () => this.handleChangeTab(TabNav.Dashboard) },
                React.createElement(Dashboard, null)),
            React.createElement(TabBar.Item, { title: I18n.t("tabbar_item_miners"), icon: require('../assets/img/icon/tab_button_miners_normal.png'), selectedIcon: require('../assets/img/icon/tab_button_miners_highlight.png'), selected: this.store.selectedTab === TabNav.Miner, onPress: () => this.handleChangeTab(TabNav.Miner) },
                React.createElement(Miner, null)),
            React.createElement(TabBar.Item, { title: I18n.t("tabbar_item_earnings"), icon: require('../assets/img/icon/tab_button_earnings_normal.png'), selectedIcon: require('../assets/img/icon/tab_button_earnings_highlight.png'), selected: this.store.selectedTab === TabNav.Income, onPress: () => this.handleChangeTab(TabNav.Income) },
                React.createElement(Earning, null)),
            React.createElement(TabBar.Item, { title: I18n.t("tabbar_item_earnings"), icon: require('../assets/img/icon/tab_button_setting_normal.png'), selectedIcon: require('../assets/img/icon/tab_button_setting_highlight.png'), selected: this.store.selectedTab === TabNav.Setting, onPress: () => this.handleChangeTab(TabNav.Setting) },
                React.createElement(Setting, null))));
    }
};
BasicTabBarExample.navigationOptions = {
    headerStyle: {
        backgroundColor: '#22A7F0',
        borderBottomWidth: 0,
        height: 0
    }
};
BasicTabBarExample = __decorate([
    inject('store'),
    observer
], BasicTabBarExample);
export default BasicTabBarExample;
//# sourceMappingURL=TabNav.js.map