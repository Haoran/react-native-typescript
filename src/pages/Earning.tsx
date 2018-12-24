import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    TouchableHighlight
} from 'react-native';
import adapt from "../interfaces/adapt";
import {formatCoin, txhash} from "../interfaces/utils";
import {Icons} from '../components/Icons';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import {navType} from "../interfaces/navType";
import {NavBar} from '../components/NavBar';
import Notice from '../components/Notice';
import moment from 'moment';
import {withNavigation} from 'react-navigation';
import I18n from "../interfaces/i18n";

const navConfig = {
    leftContent: {
        type: navType.empty,
    },
    title: {
        type: navType.text,
        text: 'Earnings'
    },
    rightContent: {
        type: navType.empty,
    }
}

@inject('store')
@observer
class App extends Component<any, any> {

    public store: any;
    @observable public regionId: any;
    @observable public istabNavgation: boolean;
    @observable public puid: any;
    @observable public coinType: any;
    @observable public refreshing: boolean;
    @observable public loading: boolean;
    @observable public page: number;
    @observable public noticeContent: string;
    @observable public display: boolean;

    static navigationOptions = {
        headerTitle: I18n.t('tabbar_item_earnings'),
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        }
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.dashboard;
        this.istabNavgation = true; // 是否是tab
        this.refreshing = false;
        this.loading = false;
        this.page = 1;
        this.noticeContent = '';
        this.display = false;

        if (this.props.navigation.state.params) {
            const {regionId, puid, coinType} = this.props.navigation.state.params;
            this.regionId = regionId;
            this.puid = puid;
            this.store.coinType = coinType;
            this.istabNavgation = false;
        }

    }

    componentWillMount() {
        this.loading = true;
        this.istabNavgation ?  this.store.getEarnStats() :this.store.getEarnStats(this.regionId, this.puid);
        this.handle_page_list(1).then(() => this.loading = false).catch(() => this.loading = false);
    }

    _onToast = (v) => {
        this.noticeContent = v;
        this.display = true;
    }

    _onPress = (item, coinType) => {
        this.props.navigation.navigate('WebviewPage', {name: I18n.t("earings_header_view_transaction"), url: txhash(coinType, item.payment_tx)})
    }

    _onRefresh() {
        this.refreshing = true;
        this.handle_page_list(1).then(() => this.refreshing = false).catch(() => this.refreshing = false);
    }

    _onEndReached() {
        if (this.store.earnHistory.length >= 20) {
            this.page++;
            this.handle_page_list(this.page);
        }
    }

    handle_page_list = async (page) => {
        this.page=page;
        if (this.istabNavgation) {
            this.store.getEarnHistory(this.page)
        }
        else {
            this.store.getEarnHistory(this.page, this.regionId, this.puid)
        }

    }

    authDispaly() {
        this.display = false;
    }

    render() {
        const {earnStats, coinType, earnHistory, showFooter} = this.store;
        return (
            <View style={styles.container}>
                <Notice content={this.noticeContent} display={this.display} authDispaly={() => this.authDispaly()}/>
                <Flex>
                    {
                        this.istabNavgation ?
                            <View style={styles.tabNav}>
                                <NavBar
                                    title={navConfig.title}
                                    leftContent={navConfig.leftContent}
                                    rightContent={navConfig.rightContent}
                                />
                            </View> : null
                    }
                </Flex>
                <View style={styles.header}>
                    <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                        <Text style={styles.statusTitle}>
                            {formatCoin(earnStats.earnings_today)} {coinType}
                        </Text>

                        <TouchableHighlight onPress={() => {
                            this._onToast(I18n.t('earings_header_view_today_tips'))
                        }}>
                            <Flex direction="row" justify="center" align="center">
                                <Text style={styles.title}>{I18n.t("earings_header_view_today")}</Text>
                                <Icons iconName="icon_header_Detail" width="10" height="10"/>
                            </Flex>
                        </TouchableHighlight>

                        <WhiteSpace size="lg"/>
                        <Text style={styles.statusTitle}>
                            {formatCoin(earnStats.total_paid)} {coinType}
                        </Text>

                        <Text style={styles.title}>{I18n.t("earings_header_view_total_paid")}</Text>
                    </Flex>

                    <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                        <Text style={styles.statusTitle}>
                            {formatCoin(earnStats.earnings_yesterday)} {coinType}
                        </Text>

                        <TouchableHighlight onPress={() => {
                            this._onToast(I18n.t('earings_header_view_yestoday_tips'))
                        }}>
                            <Flex direction="row" justify="center" align="center">
                                <Text style={styles.title}>{I18n.t("earings_header_view_yestoday")}</Text>
                                <Icons iconName="icon_header_Detail" width="10" height="10"/>
                            </Flex>
                        </TouchableHighlight>

                        <WhiteSpace size="lg"/>
                        <Text style={styles.statusTitle}>
                            {formatCoin(earnStats.unpaid)} {coinType}
                        </Text>

                        <Text style={styles.title}>{I18n.t("earings_header_view_unpaid")}</Text>
                    </Flex>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{width: '100%'}}
                    data={earnHistory}
                    keyExtractor={item => item.date.toString()}
                    onEndReached={() => this._onEndReached()}
                    onEndReachedThreshold={0}
                    ListFooterComponent={
                        <Flex justify="center" align="center" style={{height: adapt.pxToDp(50)}}>
                            {
                                showFooter == 0 ?
                                    <Text></Text> :
                                    showFooter == 1 ?
                                        <ActivityIndicator text={I18n.t("loading")} animating={showFooter == 1}/> :
                                        <Text>{I18n.t("pool_status_no_data")}</Text>
                            }
                        </Flex>
                    }
                    ListEmptyComponent={
                        <Flex justify="center" align="center" style={{height: adapt.pxToDp(120)}}>
                            {
                                !this.loading ? <Text>{I18n.t("earings_no_data")}</Text> : null
                            }
                        </Flex>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.refreshing}
                            onRefresh={() => this._onRefresh()}
                            title={I18n.t("hard_loading")}
                            titleColor="#666666"
                            progressBackgroundColor="#ffff00"
                        />
                    }
                    renderItem={({item, separators}) => (
                        <TouchableHighlight
                            onPress={() => this._onPress(item, coinType)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}
                        >
                            <Flex style={styles.list}>
                                <View style={styles.separator}>
                                    <Flex align="start" direction="column" style={{flex: 3}}>
                                        <Text style={styles.text}>
                                            {moment(item.date, "YYYY-MM-DD").format('YYYY-MM-DD')}
                                        </Text>
                                        <WhiteSpace/>
                                        <Text style={styles.subhead}>{item.payment_mode} {I18n.t("earings_cell_model")}</Text>
                                    </Flex>
                                    <Flex align="end" direction="column" style={{flex: 5}}>
                                        <Text style={styles.text}>
                                            {formatCoin(item.paid_amount)} {coinType}
                                        </Text>
                                        <WhiteSpace/>
                                        <Text style={styles.subhead}>{I18n.t("earings_cell_pay_time")} {item.payment_time}</Text>
                                    </Flex>
                                    <Flex align="center" justify="end" style={{flex: 1}}>
                                        <Icons iconName="arrow_right" width="8" height="13"/>
                                    </Flex>
                                </View>
                            </Flex>
                        </TouchableHighlight>
                    )}
                />
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
        lineHeight: adapt.pxToDp(22)
        // color:'#ffffff',
    },
    header: {
        paddingTop: adapt.pxToDp(5),
        paddingBottom: adapt.pxToDp(16),
        backgroundColor: '#22A7F0',
        width: '100%',
        flexDirection: 'row'
    },
    statusTitle: {
        fontSize: adapt.setSpText(16),
        color: '#ffffff',
        marginBottom: adapt.pxToDp(4),
    },
    title: {
        fontSize: adapt.setSpText(12),
        color: '#ffffff',
        opacity: 0.7,
        marginRight: adapt.pxToDp(5)
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    separator: {
        paddingBottom: adapt.pxToDp(13),
        paddingRight: adapt.pxToDp(13),
        paddingTop: adapt.pxToDp(13),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(229,229,229,0.5)',
        marginLeft: adapt.pxToDp(15),
    },
    list: {
        backgroundColor: '#ffffff',
    },
    text: {
        color: '#666666',
        fontSize: adapt.setSpText(15),
        fontFamily: "Helvetica Neue",
    },
    subhead: {
        color: '#999999',
        fontSize: adapt.setSpText(12),
    }
});


export default withNavigation(App);