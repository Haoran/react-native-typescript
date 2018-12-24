import {observable, action, runInAction, when} from 'mobx';
import api from "./api";
import {AsyncStorage} from "react-native";
import {storage} from "../interfaces/storage";
import {getUrlConfigByRegionID} from "../interfaces/utils";
import {Toast} from "antd-mobile-rn";

let timer;
export default class Dashboard {
    @observable public puid: string;
    @observable public regionID: any;
    @observable public account: any;
    @observable public stratum_url: any;
    @observable public loading: boolean;  //loading 加载
    @observable public earnStats: any;
    @observable public workStats: any;
    @observable public coinType: any;
    @observable public earnHistory: [];
    @observable public poolShareHistory: any;
    @observable public shareHistory: any;
    @observable public networkStatus: any;
    @observable public poolBlocks: any;
    @observable public poolStats: any;
    @observable public regionEndpoint: any;
    @observable public showFooter: number; // 0 上拉加载更多  1:正在加载中  2: 没有更多数据了

    constructor() {
        this.puid = "";
        this.regionID = "1";
        this.account = {};
        this.stratum_url = {
            config: []
        };
        this.loading = false;
        this.earnStats = {
            total_paid: 0,
            unpaid: 0,
            amount_100t: "0",
            earnings_today: 0,
            earnings_yesterday: 0,
            last_payment_time: 0,
            pending_payouts: 0,
            hashrate_yesterday: {
                size: "0",
                unit: "G"
            },
            shares_1d: {
                size: 0,
                unit: "G"
            }
        };
        this.workStats = {
            shares_15m: 0,
            shares_unit: 'G',
            workers_total: 0,
            workers_inactive: 0,
            workers_active: 0
        };
        this.coinType = "BTC";
        this.earnHistory = [];
        this.shareHistory = {
            tickers: [],
            shares_unit: 'G'
        };
        this.poolShareHistory = {
            tickers: [],
            shares_unit: 'G'
        };
        this.poolBlocks = [];
        this.poolStats = {
            shares: {
                shares_15m: 0,
                shares_unit: 'G',
            },
            blocks_count: 0,
            rewards_count: 0
        };
        this.showFooter = 0;
    }

    @action public getRegionEndpoint = async () => {
        const res = await api.regionEndpoint();
        runInAction(() => {
            this.regionEndpoint = res;
        })
    }

    @action public get_stratum_url = async () => {
        try {
            const res = await api.stratum_url({region_id: this.regionID});
            if (res && res.data) {
                runInAction(() => {
                    this.stratum_url = res.data.data[0];
                })
            }
        } catch (error) {
            console.log(error)
        }

    }

    @action public moreList = async () => {
        this.loading = true;
        let fetch_res = "success";  // success 、 failed 、 nolist
        try {
            const res = await api.moreListDash(this.puid, this.regionID);
            if (res && res.data) {
                this.loading = false;
                runInAction(() => {
                    const accountList = res.data.data.subaccounts;
                    if (accountList.length == 0) {
                        fetch_res = 'nolist'
                    } else {
                        fetch_res = 'success'
                        this.puid = this.puid ? this.puid : accountList[0].algorithms[0].coin_accounts[0].puid;
                        accountList.map(sub => {
                            sub.algorithms.map(alg => {
                                const currentAccount = alg.coin_accounts.filter(item => item.is_current == 1);
                                alg.coin_accounts.map(coin => {
                                    currentAccount.length > 0 ? coin.currentRegionId = currentAccount[0].region_id : null;
                                    if (coin.puid == this.puid) {
                                        runInAction(() => {
                                            this.account = coin;
                                            this.coinType = coin.coin_type;
                                            this.regionID = coin.region_id;
                                        })

                                    }
                                })
                            })
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
            fetch_res = 'success'
            if (!error.response) {
                Toast.offline('网络连接失败!', 2);
            }
            else {
                Toast.info(error, 2)
            }
            this.loading = false;
        }

        return fetch_res;
    }

    @action public getEarnStats = async (regionID = this.regionID, puid = this.puid) => {
        try {
            const res = await api.earnStats(regionID, {puid: puid});
            if (res && res.data) {
                runInAction(() => {
                    this.earnStats = res.data.data;
                })
            }
        }
        catch (error) {
            console.log(error)
            this.loading = false;
        }

    }

    @action public getEarnHistory = async (page = 1, regionID = this.regionID, puid = this.puid) => {
        clearTimeout(timer);
        try {
            this.showFooter = 1;
            const res = await api.earnHistory(regionID, {page: page, page_size: 20, puid: puid});
            if (res && res.data) {
                runInAction(() => {
                    this.earnHistory = page == 1 ? res.data.data.list : [...this.earnHistory, ...res.data.data.list];
                    this.showFooter = page == 1 ? 0 : res.data.data.list.length > 0 ? 0 : 2;
                    timer = setTimeout(() => {
                        this.showFooter = 0;
                    }, 1000)
                })
            }
        } catch (error) {
            this.showFooter = 0;
        }
    }

    @action public getWorkStats = async (regionID = this.regionID, puid = this.puid) => {
        try {
            const res = await api.workStats(regionID, {puid: puid});
            if (res && res.data) {
                runInAction(() => {
                    this.workStats = res.data.data;
                })
            }
        }
        catch (error) {
            this.loading = false;
        }
    }

    @action public getWorkerShareHistory = async (dimension = "1h", puid = this.puid,) => {
        const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000)
        const params = {
            puid: this.puid,
            dimension: dimension,
            start_ts: start_ts,
            real_point: 1,
            count: dimension == '1h' ? "24" : "30",
        }

        try {
            const res = await api.WorkerShareHistory(params);
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


    @action public getNetworkStatus = async () => {
        try {
            const res = await api.networkStatus();
            if (res && res.data) {
                runInAction(() => {
                    this.networkStatus = res.data.data;
                })
            }
        }
        catch (error) {
            this.loading = false;
        }
    }


    @action public getPoolShareHistory = async (dimension = "1h") => {
        const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000)
        const params = {
            puid: this.puid,
            dimension: dimension,
            start_ts: start_ts,
            real_point: 1,
            count: dimension == '1h' ? "24" : "30",
        }

        try {
            const res = await api.poolShareHistory(this.regionID, params);
            if (res && res.data) {
                runInAction(() => {
                    res.data.data.shares_unit = res.data.data.unit;
                    this.poolShareHistory = res.data.data;
                })
            }
        } catch (error) {
            runInAction(() => {
                this.poolShareHistory = {
                    tickers: [],
                    shares_unit: 'G'
                }
            })
        }
    }

    @action public getPoolBlocks = async (page = 1) => {
        clearTimeout(timer);
        this.showFooter = 1;
        try {
            const res = await api.poolBlocks(this.regionID, {
                page: page,
                page_size: 20,
                coin_type: this.coinType.toLowerCase()
            });

            if (res && res.data) {
                runInAction(() => {
                    this.poolStats.blocks_count = res.data.data.blocks_count;
                    this.poolStats.rewards_count = res.data.data.rewards_count;
                    this.poolBlocks = page == 1 ? res.data.data.blocks.data : [...this.poolBlocks, ...res.data.data.blocks.data];
                    this.showFooter = page == 1 ? 0 : res.data.data.blocks.data.length > 0 ? 0 : 2;
                    timer = setTimeout(() => {
                        this.showFooter = 0;
                    }, 1000)

                    // console.log(this.poolBlocks.length)
                })
            }
        } catch (error) {
            runInAction(() => {
                this.poolShareHistory = {
                    tickers: [],
                    shares_unit: 'G'
                }
            })

            Toast.info(error, 2);
        }

    }

    @action public getPoolStats = async () => {
        try {
            const res = await api.poolStats(this.regionID);
            if (res && res.data) {
                runInAction(() => {
                    this.poolStats = Object.assign(this.poolStats, res.data.data)
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

}