import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    RefreshControl, Keyboard
} from 'react-native';
import {Flex, List, WhiteSpace, WingBlank, Button, SearchBar, ActivityIndicator,} from 'antd-mobile-rn';
import adapt from '../interfaces/adapt'
import {Icons} from '../components/Icons';
import {inject, observer} from "mobx-react";
import ListStyle from 'antd-mobile-rn/lib/list/style/index.native';
import {DeviceEventEmitter} from 'react-native';
import {observable} from "mobx";
import I18n from "../interfaces/i18n";

const Item = List.Item;

@inject('store')
@observer
export default class SubAccount extends Component<any, any> {

    public welcome: any;
    public appStore: any;
    public listener: any;
    @observable public filter: string;
    @observable public initNoList: boolean;

    static navigationOptions = {
        headerTitle: I18n.t('hide_subaccount_manage'),
        headerStyle: {
            backgroundColor: '#22a7f0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    };

    constructor(props: any) {
        super(props);
        this.appStore = this.props.store.appStore;
        this.filter = "";
        this.initNoList=false;
    }


    componentWillMount() {
        this.appStore.isHidden = 1;
        this.appStore.moreList();
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('onHiddenRefresh', () => {
            this.appStore.refreshing = false;
            this.appStore.isHidden = 1;
            this.appStore.moreList().then(() => DeviceEventEmitter.emit('onRefresh'))
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    _onRefresh() {
        this.appStore.refreshing = true;
        this.appStore.moreList();
    }

    render() {
        const {HidAccountList, loading, coins_pic} = this.appStore;
        const list = HidAccountList.filter(a => a.name.indexOf(this.filter) >= 0);

        return (
            <Flex direction="column" justify="start" style={styles.container}>
                <SearchBar placeholder="Search"
                           style={styles.search}
                           value={this.filter}
                           onCancel={() => Keyboard.dismiss()}
                           onChange={(v) =>{this.filter = v.trim(); this.initNoList=true;}}
                />
                <ActivityIndicator text={I18n.t('loading')} toast animating={loading}/>
                <ScrollView style={styles.contentContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.appStore.refreshing}
                                    onRefresh={() => this._onRefresh()}
                                    title={I18n.t('hard_loading')}
                                    titleColor="#666666"
                                    progressBackgroundColor="#ffff00"
                                />
                            }
                >
                    {
                        list.length == 0 && this.initNoList ?
                            <Flex direction="row" justify="center" align="center" style={{width:'100%'}}>
                                <Text style={styles.noAccount}>{I18n.t('unable_search_sub_account')}</Text>
                            </Flex>
                             : null
                    }
                    {
                        list.map(item => {
                            return (
                                <View style={styles.list} key={item.name}>
                                    <View style={styles.title}><Text>{item.name} - {item.region_text} </Text></View>
                                    {
                                        item.algorithms.map(alg => {
                                            return (
                                                <List styles={_ListStyle} key={alg.algorithm_name}
                                                      renderHeader={() => `${alg.algorithm_name.toUpperCase()} - (${I18n.t('current_mode')} ${alg.current_mode_text})`}
                                                >
                                                    {
                                                        alg.coin_accounts.map(account => {
                                                            return (
                                                                <Item key={account.coin_type} arrow="horizontal"
                                                                      onClick={() => this.props.navigation.navigate('CancleAccount', {account: account})}>
                                                                    <Flex direction="row" align="center">
                                                                        {
                                                                            account.is_current == 1 ?
                                                                                <View style={styles.point}></View>
                                                                                :
                                                                                <View
                                                                                    style={{marginRight: adapt.pxToDp(15)}}></View>
                                                                        }
                                                                        <View style={styles.rip}>
                                                                        <Icons
                                                                            uri={coins_pic[account.coin_type.toLowerCase()]}
                                                                        />
                                                                        </View>
                                                                        <Text
                                                                            style={styles.chd}>{account.coin_type}</Text>
                                                                    </Flex>
                                                                </Item>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            )
                                        })
                                    }
                                </View>
                            )

                        })
                    }
                </ScrollView>
            </Flex>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
        // fontSize: 13
        // alignItems:'center'
    },
    loading: {
        width: '100%',
        height: adapt.pxToDp(400),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    search: {
        // backgroundColor: 'rgba(142,142,147,0.3)',
        borderRadius: 6,
        height: adapt.pxToDp(30)
    },
    list: {
        marginBottom: adapt.pxToDp(30),
        marginTop: adapt.pxToDp(10)
    },
    title: {
        paddingLeft: adapt.pxToDp(10),
        height: adapt.pxToDp(30),
        borderLeftWidth: adapt.pxToDp(2),
        borderLeftColor: '#22a7f0',
        justifyContent: 'center',
        backgroundColor: '#e6e9ee'
    },
    point: {
        width: adapt.pxToDp(7),
        height: adapt.pxToDp(7),
        backgroundColor: 'rgba(102,187,68,1)',
        borderRadius: 10,
        marginRight: adapt.pxToDp(8)
    },
    chd: {
        width: adapt.pxToDp(70),
        fontWeight: 'bold',
        color: 'color:rgba(3,3,3,1);',
        marginLeft: adapt.pxToDp(13)
    },
    noAccount:{
        paddingTop:adapt.pxToDp(30),
        color:'#999999',
        fontSize:adapt.setSpText(14),
        textAlign:'center'
    },
    rip: {
        width: adapt.pxToDp(30),
        height: adapt.pxToDp(30),
        borderRadius: adapt.pxToDp(15),
        overflow:'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const _ListStyle = {
    ...ListStyle,
    Header: {
        ...ListStyle.Header,
        fontSize: adapt.setSpText(11),
        color: '#6D6D72',
        paddingTop: adapt.pxToDp(12),
        paddingBottom: adapt.pxToDp(3),
        // backgroundColor: '#000',
    },
}