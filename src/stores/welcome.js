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
import api from './api';
import { Toast } from "antd-mobile-rn";
export default class Welcome {
    constructor() {
        this.handleChangeCoin = (coinType) => {
            this.coinType = coinType;
            this.multiCoinStates();
        };
        this.multiCoinStates = () => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            let back = false;
            try {
                const res = yield api.multiCoinStates();
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
                    });
                    this.getShareHistory(this.coinType);
                    back = true;
                }
                return back;
            }
            catch (error) {
                this.loading = false;
                if (!error.response) {
                    Toast.offline('网络连接失败!', 2);
                }
                else {
                    Toast.info(error, 2);
                }
                return back;
            }
        });
        this.getShareHistory = (coinType) => __awaiter(this, void 0, void 0, function* () {
            const domain = `${this.multiCoins[coinType].realtime_api_endpoint}`;
            var params = {
                start_ts: Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000),
                dimension: '1d',
                count: 30,
                real_point: 1
            };
            try {
                const res = yield api.shareHistoryByCoinType(domain, params);
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
}
__decorate([
    observable
], Welcome.prototype, "multiCoins", void 0);
__decorate([
    observable
], Welcome.prototype, "loading", void 0);
__decorate([
    observable
], Welcome.prototype, "coinStatus", void 0);
__decorate([
    observable
], Welcome.prototype, "coinType", void 0);
__decorate([
    observable
], Welcome.prototype, "HashRates", void 0);
__decorate([
    observable
], Welcome.prototype, "HashRates_suffix", void 0);
__decorate([
    observable
], Welcome.prototype, "workers", void 0);
__decorate([
    observable
], Welcome.prototype, "shareHistory", void 0);
__decorate([
    observable
], Welcome.prototype, "coins_pic", void 0);
__decorate([
    action
], Welcome.prototype, "handleChangeCoin", void 0);
__decorate([
    action
], Welcome.prototype, "multiCoinStates", void 0);
//# sourceMappingURL=welcome.js.map