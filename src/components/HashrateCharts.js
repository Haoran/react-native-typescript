import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import I18n from "../interfaces/i18n";
const moment = require('moment');
// import Echarts from 'native-echarts';
import Echarts from '../assets/lib/native-echarts/src';
import adapt from "../interfaces/adapt";
export default class HashrateCharts extends Component {
    constructor(props) {
        super(props);
    }
    toFixed(v, num) {
        return parseFloat(v).toFixed(num);
    }
    render() {
        const { shareHistory, lineColor, dimension } = this.props;
        const unit = shareHistory.shares_unit ? shareHistory.shares_unit : shareHistory.unit;
        const option = {
            // title: { text: 'ECharts demo' },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#F8BD00',
                        width: 1
                    }
                },
                formatter: `${I18n.t('time')}: {b}<br/> ${I18n.t('hashrate')}: {c} ${unit}H/s`
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                data: shareHistory.tickers ? shareHistory.tickers.map(t => dimension == "1h" ? moment.unix(t[0]).format('hh:ss') : moment.unix(t[0]).format('MM/DD')) : [],
                axisLabel: {
                    textStyle: {
                        color: lineColor ? '#666666' : '#ffffff'
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: lineColor ? '#999999' : '#ffffff',
                    }
                },
            },
            yAxis: {
                name: "       " + I18n.t('hashrate') + " (" + unit + "H/s)",
                splitLine: {
                    show: false
                },
                boundaryGap: false,
                nameTextStyle: {
                    color: lineColor ? '#666666' : '#ffffff',
                },
                axisLabel: {
                    textStyle: {
                        color: lineColor ? '#666666' : '#ffffff'
                    },
                    formatter: '{value} '
                },
                axisLine: {
                    lineStyle: {
                        color: lineColor ? '#999999' : '#ffffff',
                    }
                }
            },
            series: [{
                    name: I18n.t('hashrate'),
                    data: shareHistory.tickers ? shareHistory.tickers.map(t => +[this.toFixed(t[1] * (1 - t[2]), 2)]) : [],
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    graph: {
                        draggable: false,
                        roam: false
                    },
                    // roam: false,
                    itemStyle: {
                        normal: {
                            color: '#F8BD00',
                            lineStyle: {
                                color: '#F8BD00'
                            }
                        }
                    }
                }]
        };
        return (React.createElement(Echarts, { width: adapt.screenW() - 10, height: adapt.screenW() - 180 <= 170 ? 170 : adapt.screenW() - 180, style: styles.chart, option: option }));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    chart: {
        color: '#ffffff',
        overflow: 'hidden',
    },
});
//# sourceMappingURL=HashrateCharts.js.map