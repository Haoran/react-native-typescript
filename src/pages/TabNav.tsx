import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import {TabBar, Flex} from 'antd-mobile-rn';
import Miner from './Miner';
import Setting from './Setting';
import Earning from './Earning';
import Dashboard from './Dashboard';
import {inject, observer} from 'mobx-react';

import {TabNav} from '../interfaces/tabnav';
import I18n from "../interfaces/i18n";

@inject('store')
@observer
export default class BasicTabBarExample extends React.Component<any, any> {

    public store: any;
    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#22A7F0',
            borderBottomWidth: 0,
            height: 0
        }
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.appStore;
    }

    handleChangeTab = (tabName:TabNav ) => {
        this.store.onChangeTab(tabName);
    }


    render() {
        return (
            <TabBar
                swipeable
                unselectedTintColor="rgba(204,204,204,1)"
                tintColor="rgba(34,167,240,1)"
                barTintColor="#ffffff"
            >
                <TabBar.Item
                    title={I18n.t("tabbar_item_dashboard")}
                    icon={require('../assets/img/icon/tab_button_dashboard_normal.png')}
                    selectedIcon={require('../assets/img/icon/tab_button_dashboard_highlight.png')}
                    selected={this.store.selectedTab === TabNav.Dashboard}
                    onPress={() => this.handleChangeTab(TabNav.Dashboard)}
                >
                    <Dashboard/>
                </TabBar.Item>
                <TabBar.Item
                    title={I18n.t("tabbar_item_miners")}
                    icon={require('../assets/img/icon/tab_button_miners_normal.png')}
                    selectedIcon={require('../assets/img/icon/tab_button_miners_highlight.png')}
                    selected={this.store.selectedTab === TabNav.Miner}
                    onPress={() => this.handleChangeTab(TabNav.Miner)}
                    // badge={2}
                >
                    <Miner/>
                </TabBar.Item>
                <TabBar.Item
                    title={I18n.t("tabbar_item_earnings")}
                    icon={require('../assets/img/icon/tab_button_earnings_normal.png')}
                    selectedIcon={require('../assets/img/icon/tab_button_earnings_highlight.png')}
                    selected={this.store.selectedTab === TabNav.Income}
                    onPress={() => this.handleChangeTab(TabNav.Income)}
                >
                    <Earning/>
                </TabBar.Item>
                <TabBar.Item
                    title={I18n.t("tabbar_item_earnings")}
                    icon={require('../assets/img/icon/tab_button_setting_normal.png')}
                    selectedIcon={require('../assets/img/icon/tab_button_setting_highlight.png')}
                    selected={this.store.selectedTab === TabNav.Setting}
                    onPress={() => this.handleChangeTab(TabNav.Setting)}
                >
                    <Setting/>
                </TabBar.Item>
            </TabBar>
        );
    }
}