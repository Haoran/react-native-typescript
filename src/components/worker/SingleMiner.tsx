import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator, List, SegmentedControl} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import {inject, observer} from "mobx-react";
import moment from 'moment';
import HashrateCharts from '../HashrateCharts';
import {observable} from "mobx";

const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    @observable public dimension: any;

    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
        this.store = this.props.store.miner;
        this.dimension = "1h";
    }

    componentWillMount() {
        const {id} = this.props.navigation.state.params;
        this.store.getSingleWorker(id);
        this.store.getSingleWorkerShareHistory(id, this.dimension);
    }

    onChange = (e: any) => {
        const {id} = this.props.navigation.state.params;
        this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
        this.store.getSingleWorkerShareHistory(id, this.dimension);
    }

    toFixed(v, num) {
        return parseFloat(v).toFixed(num)
    }

    render() {

        const {singleWorker, singleWorkerShareHistory} = this.store;

        console.log(singleWorker);
        const i18_status = {
            DEAD: '已失效',
            ACTIVE: '活跃',
            INACTIVE: '不活跃',
        }
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Flex justify="center" align="center" direction="column" style={{flex: 1}}>
                        <Text style={styles.statusTitle}>
                            {singleWorker.shares_15m} {singleWorker.shares_unit}H/s
                        </Text>
                        <Text style={styles.title}>算力</Text>
                    </Flex>
                </View>

                <Flex direction="column" align="end" style={styles.Segmented}>
                    <SegmentedControl
                        values={['1小时', '1天']}
                        tintColor={'#f7ca18'}
                        style={styles.SegmentedControl}
                        onChange={this.onChange}
                    />
                    <Flex direction="column" align="end" style={styles.hashView}>
                        <HashrateCharts shareHistory={singleWorkerShareHistory}
                                        lineColor="#999999"
                                        dimension={this.dimension}
                        />
                    </Flex>
                </Flex>

                <View style={styles.poolAddress}>
                    <View style={styles.caption}>
                        <Text style={styles.caption_text}>
                            运行状态
                        </Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.text}>拒绝率</Text>
                        <Text style={styles.value}>
                            {singleWorker.reject_percent ? this.toFixed(singleWorker.reject_percent, 2) + '%' : '-'}
                        </Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.text}>状态</Text>
                        <Text style={styles.value}>{i18_status[singleWorker.worker_status]}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.text}>最近提交时间</Text>
                        <Text style={styles.value}>
                            {singleWorker.last_share_time ? singleWorker.last_share_time == 1 ? "_" :
                                moment.unix(singleWorker.last_share_time).format('YYYY-MM-DD hh:mm:ss') : '-'}
                        </Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.text}>最近提交IP</Text>
                        <Text style={styles.value}>{singleWorker.last_share_ip}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.text}>IP地址地理位置</Text>
                        <Text style={styles.value}>{singleWorker.ip2location}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: "wrap",
    },
    header: {
        paddingTop: adapt.pxToDp(5),
        paddingBottom: adapt.pxToDp(16),
        backgroundColor: '#22A7F0',
        width: '100%',
        flexDirection: 'row'
    },
    statusTitle: {
        fontSize: adapt.setSpText(20),
        color: '#ffffff',
        marginBottom: adapt.pxToDp(8),
        fontWeight: "bold"
    },
    title: {
        fontSize: adapt.setSpText(13),
        color: '#ffffff',
        opacity: 0.7,
        marginRight: adapt.pxToDp(5)
    },
    poolAddress: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'relative',
        top: 0,
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        marginBottom: '5%',
        justifyContent: 'center',
    },
    caption_text: {
        color: '#868686',
        position: 'absolute',
        textAlign: 'left',
        fontWeight:'bold',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },
    item: {
        width: '100%',
        height: 38,
        backgroundColor: '#ffffff',
        position: 'relative',
    },

    text: {
        fontSize: adapt.setSpText(14),
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        color: '#999999',
    },
    value: {
        position: 'absolute',
        right: adapt.pxToDp(15),
        textAlign: 'right',
        color: '#666666',

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
})