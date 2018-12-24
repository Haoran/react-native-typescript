var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flex, List, SegmentedControl } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import { inject, observer } from "mobx-react";
import moment from 'moment';
import HashrateCharts from '../HashrateCharts';
import { observable } from "mobx";
const Item = List.Item;
const Brief = Item.Brief;
let App = class App extends Component {
    constructor(props) {
        super(props);
        this.onChange = (e) => {
            const { id } = this.props.navigation.state.params;
            this.dimension = e.nativeEvent.selectedSegmentIndex == 0 ? '1h' : '1d';
            this.store.getSingleWorkerShareHistory(id, this.dimension);
        };
        this.store = this.props.store.miner;
        this.dimension = "1h";
    }
    componentWillMount() {
        const { id } = this.props.navigation.state.params;
        this.store.getSingleWorker(id);
        this.store.getSingleWorkerShareHistory(id, this.dimension);
    }
    toFixed(v, num) {
        return parseFloat(v).toFixed(num);
    }
    render() {
        const { singleWorker, singleWorkerShareHistory } = this.store;
        console.log(singleWorker);
        const i18_status = {
            DEAD: '已失效',
            ACTIVE: '活跃',
            INACTIVE: '不活跃',
        };
        return (React.createElement(View, { style: styles.container },
            React.createElement(View, { style: styles.header },
                React.createElement(Flex, { justify: "center", align: "center", direction: "column", style: { flex: 1 } },
                    React.createElement(Text, { style: styles.statusTitle },
                        singleWorker.shares_15m,
                        " ",
                        singleWorker.shares_unit,
                        "H/s"),
                    React.createElement(Text, { style: styles.title }, "\u7B97\u529B"))),
            React.createElement(Flex, { direction: "column", align: "end", style: styles.Segmented },
                React.createElement(SegmentedControl, { values: ['1小时', '1天'], tintColor: '#f7ca18', style: styles.SegmentedControl, onChange: this.onChange }),
                React.createElement(Flex, { direction: "column", align: "end", style: styles.hashView },
                    React.createElement(HashrateCharts, { shareHistory: singleWorkerShareHistory, lineColor: "#999999", dimension: this.dimension }))),
            React.createElement(View, { style: styles.poolAddress },
                React.createElement(View, { style: styles.caption },
                    React.createElement(Text, { style: styles.caption_text }, "\u8FD0\u884C\u72B6\u6001")),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, "\u62D2\u7EDD\u7387"),
                    React.createElement(Text, { style: styles.value }, singleWorker.reject_percent ? this.toFixed(singleWorker.reject_percent, 2) + '%' : '-')),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, "\u72B6\u6001"),
                    React.createElement(Text, { style: styles.value }, i18_status[singleWorker.worker_status])),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, "\u6700\u8FD1\u63D0\u4EA4\u65F6\u95F4"),
                    React.createElement(Text, { style: styles.value }, singleWorker.last_share_time ? singleWorker.last_share_time == 1 ? "_" :
                        moment.unix(singleWorker.last_share_time).format('YYYY-MM-DD hh:mm:ss') : '-')),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, "\u6700\u8FD1\u63D0\u4EA4IP"),
                    React.createElement(Text, { style: styles.value }, singleWorker.last_share_ip)),
                React.createElement(View, { style: styles.item },
                    React.createElement(Text, { style: styles.text }, "IP\u5730\u5740\u5730\u7406\u4F4D\u7F6E"),
                    React.createElement(Text, { style: styles.value }, singleWorker.ip2location)))));
    }
};
App.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name,
    headerStyle: {
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
__decorate([
    observable
], App.prototype, "dimension", void 0);
App = __decorate([
    inject('store'),
    observer
], App);
export default App;
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
        fontWeight: 'bold',
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
});
//# sourceMappingURL=SingleMiner.js.map