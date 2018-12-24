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
import {formatCoin, height} from "../interfaces/utils";
import HashrateCharts from '../components/HashrateCharts';
import {Icons} from '../components/Icons';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator, SegmentedControl} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import moment from 'moment';
import I18n from "../interfaces/i18n";

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    @observable public refreshing: boolean;
    @observable public page: any;
    @observable public dimension: any;

    static navigationOptions = {
        headerTitle: I18n.t('pool_status_nav_title'),
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        }
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.dashboard;
        this.refreshing = false;
        this.dimension = "1h";

    }

    componentWillMount() {
        this.page = 1;
        this.store.getPoolStats();
        this.handle_page_list(1);
        this.store.getPoolShareHistory(this.dimension);
    }

    _onPress = (item, coinType) => {
        this.props.navigation.navigate('WebviewPage', {name: I18n.t('pool_status_web_title'), url: height(coinType, item.height)})
    }

    _onRefresh() {
        this.refreshing = true;
        this.handle_page_list(1).then(() => this.refreshing = false).catch(() => this.refreshing = false)
    }

    _onEndReached() {
        if(this.store.poolBlocks.length>=20) {
            this.page++;
            this.handle_page_list(this.page);
        }
    }

    handle_page_list = async (page) => {
        this.page=page;
        this.store.getPoolBlocks(this.page)
    }

    onChange = (e: any) => {
        this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
        this.store.getPoolShareHistory(this.dimension);
    }

    render() {
        const {poolStats, poolBlocks, coinType, loading, showFooter, poolShareHistory} = this.store;

        return (
            <View style={styles.container}>
                <ActivityIndicator text={I18n.t('loading')} toast animating={loading}/>
                <View style={styles.header}>
                    <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                        <Text style={styles.statusTitle}>
                            {poolStats.shares.shares_15m} {poolStats.shares.shares_unit}H/s
                        </Text>
                        <Text style={styles.title}>{I18n.t('pool_status_header_hashrate')}</Text>

                        <WhiteSpace size="lg"/>
                        <Text style={styles.statusTitle}>
                            {poolStats.blocks_count} {I18n.t('pool_status_web_title')}
                        </Text>
                        <Flex direction="row" justify="center" align="center">
                            <Text style={styles.title}>{I18n.t('pool_status_header_found')}</Text>
                        </Flex>
                    </Flex>
                    <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                        <Text style={styles.statusTitle}>
                            {poolStats.workers}
                        </Text>
                        <Text style={styles.title}>{I18n.t('pool_status_header_miner')}</Text>

                        <WhiteSpace size="lg"/>
                        <Text style={styles.statusTitle}>
                            {floatNum(formatCoin(poolStats.rewards_count), 0)} {coinType}
                        </Text>

                        <Text style={styles.title}>{I18n.t('pool_status_header_luck')}</Text>
                    </Flex>
                </View>


                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{width: '100%'}}
                    data={poolBlocks}
                    keyExtractor={item => item.hash.toString()}
                    onEndReached={() => this._onEndReached()}
                    onEndReachedThreshold={1}
                    ListHeaderComponent={
                        <Flex direction="column" align="end" style={styles.Segmented}>
                            <SegmentedControl
                                values={[I18n.t('hours'), I18n.t('days')]}
                                tintColor={'#f7ca18'}
                                style={styles.SegmentedControl}
                                onChange={this.onChange}
                            />
                            <Flex direction="column" align="end" style={styles.hashView}>
                                <HashrateCharts shareHistory={poolShareHistory} lineColor="#999999"
                                                dimension={this.dimension}/>
                            </Flex>
                            <View style={styles.caption}>
                                <Text style={styles.caption_text}>
                                    {I18n.t('pool_status_block_relayed')}
                                </Text>
                            </View>
                        </Flex>
                    }
                    ListFooterComponent={
                        <Flex justify="center" align="center" style={{height: adapt.pxToDp(50)}}>
                            {
                                showFooter == 0 ?
                                    <Text></Text> :
                                    showFooter == 1 ?
                                        <ActivityIndicator text={I18n.t('loading')} animating={showFooter == 1}/> :
                                        <Text>{I18n.t('pool_status_no_data')}</Text>
                            }
                        </Flex>
                    }
                    ListEmptyComponent={
                        <Flex justify="center" align="center" style={{height: adapt.pxToDp(120)}}>
                            {
                                showFooter == 0 ? <Text>{I18n.t('pool_status_tips')}</Text> : null
                            }
                        </Flex>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.refreshing}
                            onRefresh={() => this._onRefresh()}
                            title={I18n.t('hard_loading')}
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
                                    <Flex align="start" direction="column" style={{flex: 5}}>
                                        <Text style={styles.text}>
                                            {item.height}
                                        </Text>
                                        <WhiteSpace/>
                                        <Text style={styles.subhead}>
                                            {moment(moment.unix(item.created_at)).format('YYYY-MM-DD HH:mm:ss')}
                                        </Text>
                                    </Flex>
                                    <Flex align="end" direction="column" style={{flex: 4}}>
                                        <Text style={styles.text}>
                                            {formatCoin(item.rewards)} {coinType}
                                        </Text>
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
        backgroundColor: '#EFEFF4',
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
    },

    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
    },

    caption_text: {
        color: '#868686',
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: '5%',
        fontSize: adapt.setSpText(15)
    },
});


const floatNum = (v, n) => {
    return parseFloat(v).toFixed(n)
}