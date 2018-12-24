import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import I18n from "../interfaces/i18n";
import {withNavigation} from 'react-navigation';
import adapt from '../interfaces/adapt'
import {navType} from "../interfaces/navType";
import {inject, observer} from "mobx-react";
import {observable, reaction, toJS} from "mobx";
import {TabNav} from '../interfaces/tabnav';
import {NavBar} from '../components/NavBar';
import Notice from '../components/Notice';
import {PoolAddress} from '../components/PoolAddress';
import {NetworkInfo} from '../components/NetworkInfo';
import {MinepoolInfo} from '../components/MinepoolInfo';
import {AccountIncome} from '../components/AccountIncome';
import {Group} from '../components/Group';
import HashrateCharts from '../components/HashrateCharts';
import GroupList from '../components/worker/GroupList';
import {Flex, List, WhiteSpace, WingBlank, Button, SegmentedControl, ActivityIndicator,} from 'antd-mobile-rn';

@inject('store')
@observer
class Dashboard extends Component<any, any> {

    public store: any;
    public appStore: any;
    public groupStore: any;
    public authStore: any;
    @observable public noticeContent: string;
    @observable public display: boolean;
    @observable public dimension: any;

    constructor(props: any) {
        super(props);
        this.store = this.props.store.dashboard;
        this.appStore = this.props.store.appStore;
        this.groupStore = this.props.store.miner;
        this.authStore = this.props.store.auth;

        this.noticeContent = '';
        this.display = false;
        this.dimension = "1h";

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
        this.httpList()
    }

    _onToast = (v) => {
        this.noticeContent = v;
        this.display = true;
    }

    _onHanleLink = (regionEndpoint) => {
        this.props.navigation.navigate('WebviewPage', {
            name: I18n.t("help"),
            url: regionEndpoint + '/app/help'
        })
    }

    authDispaly() {
        this.display = false;
    }

    onChange = (e: any) => {
        this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
        this.store.getWorkerShareHistory(this.dimension);
    }

    changeTab = (v) => {
        this.groupStore.gid = v;
        this.appStore.onChangeTab(TabNav.Miner);
        this.props.navigation.goBack();
        this.groupStore.getWorkerList(
            {
                status: "active",
                group: v,
                page: 1,
                page_size: 20,
                filter: '',
                order_by: "worker_name",
                asc: 0
            }
        )
    }

    httpList = () => {
        if (this.appStore.selectedTab == TabNav.Dashboard) {
            this.store.moreList()
                .then((res) => {
                    if (res == 'success') {
                        this.groupStore.getGroupList(this.store.puid)
                        this.store.getRegionEndpoint();
                        this.store.get_stratum_url();
                        this.store.getEarnStats();
                        this.store.getWorkStats();
                        this.store.getWorkerShareHistory(this.dimension);
                        this.store.getNetworkStatus();
                    }
                    else if (res == 'nolist') {
                        this.props.navigation.navigate('Create');
                    }
                })
        }
    }

    render() {
        const {account, stratum_url, loading, earnStats, workStats, shareHistory, coinType, networkStatus, regionEndpoint} = this.store;

        const {groupList, minerLoading} = this.groupStore;
        const navConfig = {
            leftContent: {
                type: navType.empty,
            },
            title: {
                type: navType.text,
                text: account.name ? account.name + '@' + account.coin_type + '-' + account.region_text : '-'

            },
            rightContent: {
                type: navType.text,
                text: 'Switch'
            }
        }
        return (
            <View style={styles.container}>
                <ActivityIndicator text={I18n.t('loading')} toast animating={loading}/>
                <Notice content={this.noticeContent} display={this.display} authDispaly={() => this.authDispaly()}/>
                <View style={styles.tabNav}>
                    <NavBar
                        title={navConfig.title}
                        leftContent={navConfig.leftContent}
                        rightContent={navConfig.rightContent}
                        handleClick={(type) => type == 'right' ? this.props.navigation.navigate('SubAccount', {
                            linkByDashboard: true,
                        }) : null}
                    />
                </View>

                <ScrollView style={styles.box} bounces={false} showsVerticalScrollIndicator={false}>

                    <MinepoolInfo
                        earnStats={earnStats}
                        workStats={workStats}
                        account={account}
                        onToast={(v) => this._onToast(v)}
                    />

                    <Flex direction="column" align="end" style={styles.Segmented}>
                        <SegmentedControl
                            values={[I18n.t('hours'), I18n.t('days')]}
                            tintColor={'#f7ca18'}
                            style={styles.SegmentedControl}
                            onChange={this.onChange}
                        />
                        <Flex direction="column" align="end" style={styles.hashView}>
                            <HashrateCharts shareHistory={shareHistory} lineColor="#999999" dimension={this.dimension}/>
                        </Flex>
                    </Flex>

                    <View style={styles.caption}>
                        <Text style={styles.caption_text}>
                            {I18n.t('group_manager')}
                        </Text>
                        <Text style={styles.caption_more}
                              onPress={() => this.props.navigation.navigate("GroupList")}> {I18n.t('more')}</Text>
                    </View>

                    <Group group={groupList} loading={minerLoading} changeTab={gid => this.changeTab(gid)}/>

                    <WhiteSpace/>
                    <AccountIncome earnStats={earnStats}
                                   handleTab={(v) => this.appStore.onChangeTab(v)}
                                   coinType={coinType}
                    />

                    <PoolAddress name={account.name}
                                 stratum_url={stratum_url}
                                 handleLink={() => this._onHanleLink(regionEndpoint)}
                    />

                    {
                        networkStatus ?
                            <NetworkInfo networkStatus={networkStatus} coinType={coinType}/> : null
                    }

                    <WhiteSpace size="xl"/>
                    <Flex direction="column" align="center" justify="center">
                        <Button type="primary" style={styles.button}
                                onPressOut={() => this.props.navigation.navigate('PoolStats')}>
                            <Text>{I18n.t('view_pool_status')}</Text>
                        </Button>
                        <WhiteSpace size="lg"/>
                        {/*<Button type="primary" style={styles.button}*/}
                        {/*onPressOut={() => this.props.navigation.navigate('Login', {name: 'login'})}>*/}
                        {/*<Text>观察者链接</Text>*/}
                        {/*</Button>*/}
                    </Flex>
                    <WhiteSpace size="xl"/>
                    <WhiteSpace size="xl"/>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },

    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
    },

    box: {
        width: '100%',
    },

    Segmented: {
        backgroundColor: "#ffffff",
        paddingTop: adapt.pxToDp(12),
        zIndex: 99,
    },

    SegmentedControl: {
        height: adapt.pxToDp(23),
        width: adapt.pxToDp(84),
        marginRight: adapt.pxToDp(20),
        zIndex: 100,
    },

    hashView: {
        backgroundColor: "#ffffff",
        paddingLeft: adapt.pxToDp(15),
        marginTop: adapt.pxToDp(-33),
        marginBottom: 0,
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
    },
    caption_text: {
        fontWeight: 'bold',
        color: '#999999',
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },

    caption_more: {
        color: '#2194ed',
        position: 'absolute',
        right: 0,
        height: '100%',
        padding: adapt.pxToDp(15),
        textAlign: 'right',
        fontSize: adapt.setSpText(15)
    },

    button: {
        height: adapt.pxToDp(41),
        width: '80%',
        backgroundColor: '#22A7F0',
    },

    buttonCore: {
        // width:'80%',
        fontSize: adapt.setSpText(16),
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2194ed',
        // margin:'5% 10%',
        color: '#ffffff',
        // borderBottomLeftRadius:10,
        // borderBottomRightRadius:10,

        borderRadius: 30,
        borderColor: '#2194ed',
    },


});


export default withNavigation(Dashboard)