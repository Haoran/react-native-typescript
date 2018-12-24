var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable, action, runInAction } from 'mobx';
import api from "./api";
import { Toast } from "antd-mobile-rn";
let timer;
export default class Dashboard {
    constructor() {
        this.getRegionEndpoint = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.regionEndpoint();
            runInAction(() => {
                this.regionEndpoint = res;
            });
        });
        this.get_stratum_url = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.stratum_url({ region_id: this.regionID });
                if (res && res.data) {
                    runInAction(() => {
                        this.stratum_url = res.data.data[0];
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.moreList = () => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            let fetch_res = "success"; // success 、 failed 、 nolist
            try {
                const res = yield api.moreListDash(this.puid, this.regionID);
                if (res && res.data) {
                    this.loading = false;
                    runInAction(() => {
                        const accountList = res.data.data.subaccounts;
                        if (accountList.length == 0) {
                            fetch_res = 'nolist';
                        }
                        else {
                            fetch_res = 'success';
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
                                            });
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            }
            catch (error) {
                console.log(error);
                fetch_res = 'success';
                if (!error.response) {
                    Toast.offline('网络连接失败!', 2);
                }
                else {
                    Toast.info(error, 2);
                }
                this.loading = false;
            }
            return fetch_res;
        });
        this.getEarnStats = (regionID = this.regionID, puid = this.puid) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.earnStats(regionID, { puid: puid });
                if (res && res.data) {
                    runInAction(() => {
                        this.earnStats = res.data.data;
                    });
                }
            }
            catch (error) {
                console.log(error);
                this.loading = false;
            }
        });
        this.getEarnHistory = (page = 1, regionID = this.regionID, puid = this.puid) => __awaiter(this, void 0, void 0, function* () {
            clearTimeout(timer);
            try {
                this.showFooter = 1;
                const res = yield api.earnHistory(regionID, { page: page, page_size: 20, puid: puid });
                if (res && res.data) {
                    runInAction(() => {
                        this.earnHistory = page == 1 ? res.data.data.list : [...this.earnHistory, ...res.data.data.list];
                        this.showFooter = page == 1 ? 0 : res.data.data.list.length > 0 ? 0 : 2;
                        timer = setTimeout(() => {
                            this.showFooter = 0;
                        }, 1000);
                    });
                }
            }
            catch (error) {
                this.showFooter = 0;
            }
        });
        this.getWorkStats = (regionID = this.regionID, puid = this.puid) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.workStats(regionID, { puid: puid });
                if (res && res.data) {
                    runInAction(() => {
                        this.workStats = res.data.data;
                    });
                }
            }
            catch (error) {
                this.loading = false;
            }
        });
        this.getWorkerShareHistory = (dimension = "1h", puid = this.puid) => __awaiter(this, void 0, void 0, function* () {
            const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000);
            const params = {
                puid: this.puid,
                dimension: dimension,
                start_ts: start_ts,
                real_point: 1,
                count: dimension == '1h' ? "24" : "30",
            };
            try {
                const res = yield api.WorkerShareHistory(params);
                if (res && res.data) {
                    runInAction(() => {
                        this.shareHistory = res.data.data;
                    });
                }
            }
            catch (error) {
                runInAction(() => {
                    this.shareHistory = {
                        tickers: [],
                        shares_unit: 'G'
                    };
                });
            }
        });
        this.getNetworkStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.networkStatus();
                if (res && res.data) {
                    runInAction(() => {
                        this.networkStatus = res.data.data;
                    });
                }
            }
            catch (error) {
                this.loading = false;
            }
        });
        this.getPoolShareHistory = (dimension = "1h") => __awaiter(this, void 0, void 0, function* () {
            const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000);
            const params = {
                puid: this.puid,
                dimension: dimension,
                start_ts: start_ts,
                real_point: 1,
                count: dimension == '1h' ? "24" : "30",
            };
            try {
                const res = yield api.poolShareHistory(this.regionID, params);
                if (res && res.data) {
                    runInAction(() => {
                        res.data.data.shares_unit = res.data.data.unit;
                        this.poolShareHistory = res.data.data;
                    });
                }
            }
            catch (error) {
                runInAction(() => {
                    this.poolShareHistory = {
                        tickers: [],
                        shares_unit: 'G'
                    };
                });
            }
        });
        this.getPoolBlocks = (page = 1) => __awaiter(this, void 0, void 0, function* () {
            clearTimeout(timer);
            this.showFooter = 1;
            try {
                const res = yield api.poolBlocks(this.regionID, {
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
                        }, 1000);
                        // console.log(this.poolBlocks.length)
                    });
                }
            }
            catch (error) {
                runInAction(() => {
                    this.poolShareHistory = {
                        tickers: [],
                        shares_unit: 'G'
                    };
                });
                Toast.info(error, 2);
            }
        });
        this.getPoolStats = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.poolStats(this.regionID);
                if (res && res.data) {
                    runInAction(() => {
                        this.poolStats = Object.assign(this.poolStats, res.data.data);
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
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
}
__decorate([
    observable
], Dashboard.prototype, "puid", void 0);
__decorate([
    observable
], Dashboard.prototype, "regionID", void 0);
__decorate([
    observable
], Dashboard.prototype, "account", void 0);
__decorate([
    observable
], Dashboard.prototype, "stratum_url", void 0);
__decorate([
    observable
], Dashboard.prototype, "loading", void 0);
__decorate([
    observable
], Dashboard.prototype, "earnStats", void 0);
__decorate([
    observable
], Dashboard.prototype, "workStats", void 0);
__decorate([
    observable
], Dashboard.prototype, "coinType", void 0);
__decorate([
    observable
], Dashboard.prototype, "earnHistory", void 0);
__decorate([
    observable
], Dashboard.prototype, "poolShareHistory", void 0);
__decorate([
    observable
], Dashboard.prototype, "shareHistory", void 0);
__decorate([
    observable
], Dashboard.prototype, "networkStatus", void 0);
__decorate([
    observable
], Dashboard.prototype, "poolBlocks", void 0);
__decorate([
    observable
], Dashboard.prototype, "poolStats", void 0);
__decorate([
    observable
], Dashboard.prototype, "regionEndpoint", void 0);
__decorate([
    observable
], Dashboard.prototype, "showFooter", void 0);
__decorate([
    action
], Dashboard.prototype, "getRegionEndpoint", void 0);
__decorate([
    action
], Dashboard.prototype, "get_stratum_url", void 0);
__decorate([
    action
], Dashboard.prototype, "moreList", void 0);
__decorate([
    action
], Dashboard.prototype, "getEarnStats", void 0);
__decorate([
    action
], Dashboard.prototype, "getEarnHistory", void 0);
__decorate([
    action
], Dashboard.prototype, "getWorkStats", void 0);
__decorate([
    action
], Dashboard.prototype, "getWorkerShareHistory", void 0);
__decorate([
    action
], Dashboard.prototype, "getNetworkStatus", void 0);
__decorate([
    action
], Dashboard.prototype, "getPoolShareHistory", void 0);
__decorate([
    action
], Dashboard.prototype, "getPoolBlocks", void 0);
__decorate([
    action
], Dashboard.prototype, "getPoolStats", void 0);
//# sourceMappingURL=dashboard.js.map