import React from 'react';
import adapt from '../interfaces/adapt'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Icons} from '../components/Icons';
import {Flex, List, WhiteSpace, WingBlank, Button, ActivityIndicator, Picker, Toast} from 'antd-mobile-rn';
import {NavBar} from '../components/NavBar'
import {navType} from '../interfaces/navType';
import {inject, observer} from "mobx-react";
import {NavigationActions, StackActions} from 'react-navigation';


import CookieManager from 'react-native-cookies';
import {reaction} from "mobx";
import {TabNav} from "../interfaces/tabnav";

const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
class Setting extends React.Component<any, any> {

    public accountStore: any;
    public dashboardStore: any;
    public appStore: any;
    public auth: any;

    constructor(props: any) {
        super(props);
        this.accountStore = this.props.store.modifyAccount;
        this.dashboardStore = this.props.store.dashboard;
        this.appStore = this.props.store.appStore;
        this.auth = this.props.store.auth;

        reaction(
            () => this.appStore.isConnected,
            isConnected => this.httpList()
        )

        reaction(
            () => this.appStore.selectedTab,
            selectedTab => this.httpList()
        )
    }

    componentWillMount() {
        this.httpList();
    }

    httpList(){
        if(this.appStore.selectedTab==TabNav.Setting){
            const {regionID, puid} = this.dashboardStore;
            this.accountStore.getAccountInfo(regionID, puid);
        }
    }

    getHoursArray = () => {
        let hours = new Array();
        for (let i = 2; i <= 24; i++) {
            hours.push({label: i + ' hours', value: i});
        }
        return hours;
    }

    handleAlertInterval = (v, account) => {
        this.accountStore.setAlertInterval(account.region_id, account.puid, v)
    }

    clearAsyncStorage = async () => {
        CookieManager.clearAll().then((res) => {
            console.log('CookieManager.clearAll =>', res);
        });

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Welcome'})]
        });

        const errs =await AsyncStorage.clear();
        if(errs){
            Toast.info('退出失败!', 2);
        }
        else{
            console.log("退出成功")
            this.dashboardStore.puid = "";
            this.dashboardStore.regionID = "";
            this.auth.logout();
            this.props.navigation.dispatch(resetAction);
        }

    }

    render() {
        const {account} = this.dashboardStore;
        const {accountInfo, loading} = this.accountStore;

        const navConfig = {
            leftContent: {
                type: navType.empty,
            },
            title: {
                type: navType.text,
                text: account.name ? account.name + '@' + account.coin_type + '-' + account.region_text : '-'
            },
            rightContent: {
                type: navType.icon,
                iconName: 'button_header_menu'
            }
        }

        return (
            <Flex direction="column" justify="start" style={styles.container}>
                <ActivityIndicator text="正在加载..." toast animating={loading}/>
                <View style={styles.tabNav}>
                    <NavBar
                        title={navConfig.title}
                        leftContent={navConfig.leftContent}
                        rightContent={navConfig.rightContent}
                        handleClick={(type) => type == 'right' ? this.props.navigation.navigate('SubAccount') : null}
                    />
                </View>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <List renderHeader={() => 'BELONG TO ACCOUNT'}>
                        <Item>{accountInfo.contact.phone.number ? accountInfo.contact.phone.number : accountInfo.contact.mail}</Item>
                    </List>

                    <List renderHeader={() => 'SUB-ACCOUNTS SETTING'}>
                        <Item arrow="horizontal"
                              onClick={() => this.props.navigation.navigate('ModifyAddress',
                                  {
                                      address: accountInfo.address,
                                      name: 'Payment Address',
                                  })}
                        >
                            Payment Address
                        </Item>

                        <Item arrow="horizontal"
                              onClick={() => this.props.navigation.navigate('ModifyAddress',
                                  {
                                      address: accountInfo.nmc_address,
                                      name: 'NMC Subsidy Address',
                                  })}
                        >
                            NMC Subsidy Address
                        </Item>
                        <Item arrow="horizontal"
                              onClick={() => this.props.navigation.navigate('OneButtonSwitch',
                                  {
                                      current_regionId: account.currentRegionId,
                                      current_puid: accountInfo.current_puid,
                                      current_mode: accountInfo.current_mode,
                                      support_coins: accountInfo.current_support_coins
                                  })}
                        >
                            One-button switch
                        </Item>
                    </List>

                    <List renderHeader={() => 'ALERT SETTING'}>

                        <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertSettingHashrate',
                            {
                                regionId: account.region_id,
                                puid: account.puid,
                                hashrate_alert: accountInfo.alert.hashrate_alert,
                                hashrate_value: accountInfo.alert.hashrate_value,
                                hashrate_unit: accountInfo.alert.hashrate_unit,
                            })}>
                            <Text style={styles.text}>
                                Warn me when hashrate
                                ≤ {accountInfo.alert.hashrate_value} {accountInfo.alert.hashrate_unit}H/s
                            </Text>
                        </Item>

                        <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertSettingMiner',
                            {
                                regionId: account.region_id,
                                puid: account.puid,
                                miner_alert: accountInfo.alert.miner_alert,
                                miner_value: accountInfo.alert.miner_value,
                            })}>
                            <Text style={styles.text}>
                                Warn me when active miner ≤ {accountInfo.alert.miner_value}
                            </Text>
                        </Item>

                        <Item extra={
                            <Picker
                                okText="确定"
                                dismissText="取消"
                                data={this.getHoursArray()}
                                cols={1}
                                value={[accountInfo.alert.alert_interval]}
                                onOk={(v: any) => {
                                    this.handleAlertInterval(v[0], account)
                                }}
                            >
                                <CustomChildren/>
                            </Picker>
                        }>
                            <Text style={styles.text}>
                                Don’t warn me twice in {accountInfo.alert.alert_interval} hours
                            </Text>
                        </Item>

                    </List>

                    <WhiteSpace size="xl"/>
                    <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('AlertContact',
                        {
                            regionId: account.region_id,
                            puid: account.puid,
                        })}
                    >
                        Alert Contacts
                    </Item>

                    <WhiteSpace size="xl"/>
                    <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('Watchers', {
                        puid: account.puid,
                    })}
                    >
                        Share to Watcher
                    </Item>

                    <WhiteSpace size="xl"/>
                    <Item arrow="horizontal" onClick={() => this.props.navigation.navigate('Earning', {
                        regionId: account.region_id,
                        puid: account.puid,
                        coinType: account.coin_type,
                    })}>
                        View Earnings History
                    </Item>

                    <WhiteSpace size="xl"/>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('PaymentAddress')}>Feedback</Item>

                    <WhiteSpace size="xl"/>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('Language')}>Languages</Item>

                    <WhiteSpace size="xl"/>
                    <WhiteSpace size="xl"/>
                    <Flex justify="center">
                        <Button type="warning" style={styles.signOut} onClick={() => this.clearAsyncStorage()}>
                            Sign out
                        </Button>
                    </Flex>
                    <WhiteSpace size="xl"/>

                </ScrollView>
            </Flex>
        );
    }
}

const CustomChildren = (props: any) => (
    <TouchableOpacity onPress={props.onClick}>
        <Flex justify='end' align="center" style={{height: adapt.pxToDp(20), width: adapt.pxToDp(60)}}>
            <Icons iconName="arrow_right" width="8" height="13"/>
        </Flex>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
        // alignItems:'center'
    },

    container: {
        flex: 1,
        backgroundColor: 'rgba(239,239,244,1)'
    },
    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
        // color:'#ffffff',
    },
    group: {
        borderTopWidth: adapt.pxToDp(1),
        borderBottomWidth: adapt.pxToDp(1),
        borderColor: '#C8C7CC',
        backgroundColor: '#ffffff',
        paddingLeft: adapt.pxToDp(15),
    },

    LabelContent: {
        marginTop: adapt.pxToDp(15),
        borderTopWidth: adapt.pxToDp(1),
        borderBottomWidth: adapt.pxToDp(1),
        borderColor: '#C8C7CC',
    },
    signOut: {
        width: '75%',
        borderRadius: 0,
        backgroundColor: '#ff3b30'
    },
    text: {
        fontSize: adapt.setSpText(17)
    }

});


export default withNavigation(Setting);