import {
    observable,
    action,
    computed,
    reaction,
    runInAction
} from 'mobx';

import api from './api';
import {Toast} from "antd-mobile-rn";
import {resolve} from "url";


export default class Welcome {
    @observable public multiCoins: any;
    @observable public loading: boolean;
    @observable public coinStatus: any;
    @observable public coinType: string;
    @observable public HashRates: number;
    @observable public HashRates_suffix: string;
    @observable public workers: number;
    @observable public shareHistory: any;
    @observable public coins_pic: any;

    constructor() {
        this.loading = false;
        this.multiCoins = {};
        this.coinType = 'btc';
        this.HashRates = 0;
        this.HashRates_suffix = 'G';
        this.workers = 0;
        this.shareHistory = {
            shares_15m: '-',
            unit: "G"
        };
        this.coins_pic = {};
    }

    @action public handleChangeCoin = (coinType: string) => {
        this.coinType = coinType;
        this.multiCoinStates();
    }

    @action public multiCoinStates = async () => {
        this.loading = true;
        let back = false;
        try {
            const res = await api.multiCoinStates();
            if (res && res.data) {
                this.loading = false;
                let result = res.data.data;
                for (let key in result) {
                    result[key] = Object.assign({
                        stats: {
                            shares: {
                                shares_15m: '-',
                                shares_unit: "G"
                            },
                            workers: '-'
                        }
                    }, result[key]);
                }

                runInAction(() => {
                    this.multiCoins = result;
                })

                this.getShareHistory(this.coinType);
                back = true
            }

            return back;
        } catch (error) {
            this.loading = false;
            if (!error.response) {
                Toast.offline('网络连接失败!', 2);
            }
            else{
                Toast.info(error,2)
            }
            return back;
        }
    }

    getShareHistory = async (coinType) => {
        const domain = `${this.multiCoins[coinType].realtime_api_endpoint}`;
        var params = {
            start_ts: Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000),
            dimension: '1d',
            count: 30,
            real_point: 1
        }
        try {
            const res = await api.shareHistoryByCoinType(domain, params);
            if (res && res.data) {
                runInAction(() => {
                    this.shareHistory = res.data.data;
                })
            }
        } catch (error) {
            runInAction(() => {
                this.shareHistory = {
                    tickers: [],
                    shares_unit: 'G'
                }
            })
        }

    }
}
