import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import {Flex, WhiteSpace, WingBlank, Button, NoticeBar, InputItem,} from 'antd-mobile-rn';
import adapt from '../interfaces/adapt'
import {Icons} from '../components/Icons';
import {observable, toJS} from "mobx";
import {inject, observer} from "mobx-react";
import Notice from '../components/Notice';
import {NavigationActions, StackActions} from 'react-navigation'
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';
import {TabNav} from "../interfaces/tabnav";
import I18n from "../interfaces/i18n";


const lang = I18n.getLanguage();
@inject('store')
@observer
export default class Create extends Component<any, any> {

    public store: any;
    public appStore: any;
    public dashboard: any;
    @observable name: any;
    @observable coin_type: any;
    @observable regionID: any;
    @observable regionName: any;
    @observable address: any;

    static navigationOptions = {
        headerTitle: I18n.t("creat_worker_title"),
        headerStyle: {
            backgroundColor: '#22a7f0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.create;
        this.appStore = this.props.store.appStore;
        this.dashboard = this.props.store.dashboard;
        this.coin_type = 'BTC';
        this.regionID = "";
        this.address = "";
    }

    componentWillMount() {
        this.store.getCoinsPic();
        this.store.getNodeList().then(res => {
            const region = this.store.nodeList.filter(region => region.type == this.coin_type);
            this.regionID = region[0] ? region[0].id : "";
            this.regionName = region[0] ? region[0].name : "";
        })
    }

    handleUpdateCoin = (coinType) => {
        this.coin_type = coinType.toUpperCase();
        const region = this.store.nodeList.filter(region => region.type == this.coin_type);
        this.regionID = region[0] ? region[0].id : "";
        this.regionName = region[0] ? region[0].name : "";
    }

    handleUpdateRegion = (region) => {
        this.regionID = region.id;
        this.regionName = region.name;
    }

    automatic = () => {
        let random = Math.random().toString(36).replace(/i/g, 'j').replace(/l/g, 'm').replace(/o/g, 'p').replace(/1/g, '2').replace(/0/g, '3').substr(2, 8);
        this.name = random;
    }

    create = () => {
        if (!this.regionID) {
            this.store.waringDisplay = true;
            this.store.waringText = I18n.t("creat_worker_region");
            return;
        }
        if (!this.name) {
            this.store.waringDisplay = true;
            this.store.waringText = I18n.t("creat_worker_finish");
            return;
        }

        this.store.create(this.regionID, this.regionName, this.name, this.coin_type, this.address)
            .then(res => {
                if (res) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'TabNav'})]
                    });
                    this.appStore.onChangeTab(TabNav.Dashboard);
                    this.dashboard.puid = res[0];
                    this.dashboard.regionID = res[1];
                    this.props.navigation.dispatch(resetAction);
                }
            });
    }

    authDispaly() {
        this.store.waringDisplay = false;
    }

    render() {
        const {coins, nodeList, loading, waringDisplay, waringText} = this.store;

        return (
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Notice content={waringText} display={waringDisplay} authDispaly={() => this.authDispaly()}/>
                <View style={{marginTop: adapt.pxToDp(20)}}>
                    <WingBlank><Text
                        style={{fontSize: adapt.setSpText(13)}}>{I18n.t("creat_worker_cointype")}</Text></WingBlank>
                    <View style={styles.scrollView}>
                        <ScrollView horizontal={true} contentContainerStyle={styles.area}
                                    showsHorizontalScrollIndicator={false}>
                            {
                                Object.keys(coins).map(item => {
                                    return (
                                        <TouchableOpacity onPress={() => this.handleUpdateCoin(item)} key={item}>
                                            <Flex direction="row">
                                                <View
                                                    style={this.coin_type == item.toUpperCase() ? styles.scrollActive : styles.scroll}>
                                                    <Icons uri={coins[item]} width="25" height="25"/>
                                                    <Text
                                                        style={this.coin_type == item.toUpperCase() ? styles.textActive : styles.text}>{item.toUpperCase()}</Text>
                                                </View>
                                                <View style={styles.line}/>
                                            </Flex>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <WhiteSpace size="sm"/>
                    <WingBlank>

                        <Text style={styles.note}>
                            {I18n.t("creat_worker_dec")}{Object.keys(coins).map(t => t.toUpperCase() + '、')} {I18n.t("creat_worker_look")}
                        </Text>
                    </WingBlank>
                </View>

                <View style={{marginTop: adapt.pxToDp(20)}}>
                    <WingBlank>
                        <Text style={{fontSize: adapt.setSpText(13)}}>
                            {I18n.t("creat_worker_select_region")}
                        </Text>
                    </WingBlank>
                    <View style={styles.scrollView}>
                        <ScrollView horizontal={true} contentContainerStyle={styles.area}
                                    showsHorizontalScrollIndicator={false}>
                            {
                                nodeList.map(region => {
                                    return (
                                        region.type == this.coin_type ?
                                            <TouchableOpacity onPress={() => this.handleUpdateRegion(region)}
                                                              key={region.id}>
                                                <Flex direction="row">
                                                    <View
                                                        style={this.regionID == region.id ? styles.scrollActive : styles.scroll}>
                                                        <Icons uri={region.config.app_country_pic} width="25"
                                                               height="25"/>
                                                        <Text
                                                            style={this.regionID == region.id ? styles.textActive : styles.text}>{region.config.text[lang]}</Text>
                                                    </View>
                                                    <View style={styles.line}/>
                                                </Flex>
                                            </TouchableOpacity>
                                            : null
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <WhiteSpace size="sm"/>
                    <WingBlank>
                        <Text style={styles.note}>{I18n.t("creat_worker_select_region_tips")}</Text>
                    </WingBlank>
                </View>

                <View style={{marginTop: adapt.pxToDp(20)}}>
                    <WingBlank><Text
                        style={{fontSize: adapt.setSpText(13)}}>{I18n.t("creat_worker_set_name")}</Text></WingBlank>
                    <View style={styles.inputView}>
                        <TextInput style={styles.input}
                                   maxLength={20}
                                   placeholder={I18n.t("creat_worker_set_name_placehold")}
                                   value={this.name}
                                   onChangeText={(text) => this.name = text}
                        />
                        <TouchableOpacity onPress={() => {
                            this.automatic()
                        }}>
                            <Text style={{color: '#22A7F0', fontSize: adapt.setSpText(15)}}>Automatic</Text>
                        </TouchableOpacity>
                    </View>
                    <WhiteSpace size="sm"/>
                    <WingBlank>
                        <Text style={styles.note}>
                            {I18n.t("creat_worker_set_name_tips")}
                        </Text>
                    </WingBlank>
                </View>

                <View style={{marginTop: adapt.pxToDp(20)}}>
                    <WingBlank style={{flexDirection: "row"}}>
                        <Text style={{fontSize: adapt.setSpText(13)}}>{I18n.t("creat_worker_set_address")} </Text>
                        <Text style={{color: '#FF3B30'}}>{I18n.t("creat_worker_option")}</Text>
                    </WingBlank>
                    <View style={styles.inputView}>
                        <TextInput style={styles.input} value={this.address}
                                   onChangeText={(text) => this.address = text}/>
                    </View>
                    <WhiteSpace size="sm"/>
                    <WingBlank>
                        {
                            this.coin_type.toLowerCase() == 'btc' || this.coin_type.toLowerCase() == 'ubtc' || this.coin_type.toLowerCase() == 'bch' ?
                                <Text style={Object.assign(styles.note, {color: '#FF3B30'})}>
                                    {I18n.t("creat_optional_" + this.coin_type.toLowerCase())}
                                </Text> :
                                <Text style={Object.assign(styles.note, {color: '#FF3B30'})}>
                                    {I18n.t("creat_optional_coin")}
                                </Text>
                        }
                    </WingBlank>
                </View>

                <Button onPressOut={() => this.create()}
                        style={styles.submit} styles={_btnStyle} disabled={loading} loading={loading}>
                    {I18n.t("creat_worker_go_mining")}
                </Button>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
    },
    scrollView: {
        height: adapt.pxToDp(62),
        marginTop: adapt.pxToDp(6),
    },
    area: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.12)',
        minWidth: '100%'
    },
    scroll: {
        paddingTop: adapt.pxToDp(8),
        minWidth: adapt.pxToDp(80),
        height: adapt.pxToDp(62),
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    scrollActive: {
        paddingTop: adapt.pxToDp(8),
        minWidth: adapt.pxToDp(80),
        height: adapt.pxToDp(62),
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        borderColor: '#22A7F0',
        borderBottomWidth: 2
    },
    text: {
        height: adapt.pxToDp(20),
        lineHeight: adapt.pxToDp(20),
        color: '#999999',
        marginTop: adapt.pxToDp(3),
        fontSize: adapt.setSpText(14),
        paddingLeft: adapt.pxToDp(3),
        paddingRight: adapt.pxToDp(3),
    },
    textActive: {
        height: adapt.pxToDp(20),
        lineHeight: adapt.pxToDp(20),
        color: '#22A7F0',
        marginTop: adapt.pxToDp(3),
        paddingLeft: adapt.pxToDp(3),
        paddingRight: adapt.pxToDp(3),
        fontSize: adapt.setSpText(14)
    },
    note: {
        fontSize: adapt.pxToDp(11),
        lineHeight: adapt.pxToDp(15),
        color: '#8E8E93'
    },
    inputView: {
        height: adapt.pxToDp(40),
        marginTop: adapt.pxToDp(6),
        backgroundColor: '#ffffff',
        width: adapt.screenW(),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: adapt.pxToDp(15),
        paddingRight: adapt.pxToDp(15)
    },
    input: {
        flex: 4,
        height: adapt.pxToDp(40),
    },
    submit: {
        marginTop: adapt.pxToDp(40),
        backgroundColor: '#ffffff',
        width: adapt.screenW(),
        height: adapt.pxToDp(40),
        borderWidth: 0
    },
    line: {
        borderStyle: 'solid',
        borderColor: '#E0E0E0',
        borderRightWidth: 1,
        height: adapt.pxToDp(20)
    }
})

const _btnStyle = {
    ...btnStyle,
    defaultRawText: {
        ...btnStyle.defaultRawText,
        color: '#22A7F0',
        fontSize: adapt.setSpText(16)
    },
}
