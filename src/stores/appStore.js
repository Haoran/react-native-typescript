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
import { TabNav } from '../interfaces/tabnav';
import api from './api';
import { Toast } from "antd-mobile-rn";
import { storage } from "../interfaces/storage";
import { AsyncStorage } from "react-native";
import { save_log } from '../interfaces/utils';
import { language } from '../interfaces/lang';
export default class AppStore {
    constructor() {
        this.onChangeTab = (tabName) => {
            this.selectedTab = tabName;
        };
        this.moreList = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.loading = this.refreshing ? false : true;
                const res = yield api.moreList({ is_hidden: this.isHidden });
                let currentAccount = {}, accountName = "";
                if (res && res.data) {
                    const accountList = res.data.data.subaccounts;
                    this.puids = {};
                    accountList.map(sub => {
                        sub.algorithms.map(alg => {
                            alg.coin_accounts.map(coin => {
                                if (coin.is_current == 1) {
                                    alg.current_regionId = coin.region_id;
                                    let region = coin.region_id;
                                    let ids = this.puids[region] ? this.puids[region] + ',' + coin.puid : coin.puid.toString();
                                    this.puids[region] = ids.replace(/,$/g, "");
                                }
                                if (this.puid && coin.puid == this.puid) {
                                    currentAccount = sub;
                                    accountName = sub.name;
                                }
                            });
                        });
                    });
                    // 当前子账户排在首位
                    const accounts = accountList.filter(item => item.name != accountName);
                    accounts.unshift(currentAccount);
                    runInAction(() => {
                        this.isHidden == 0 ? this.accountList = accounts : this.HidAccountList = accountList;
                        this.isHidden == 1 ? this.loading = false : null;
                        this.refreshing = false;
                    });
                }
            }
            catch (_a) {
                this.loading = false;
                this.refreshing = false;
                Toast.info('数据异常!', 1);
            }
        });
        this.getHashrate = () => __awaiter(this, void 0, void 0, function* () {
            let hashrateByPuid = {};
            let timer;
            for (let key in this.puids) {
                Promise.race([api.hashrateByRegion(key, { puids: this.puids[key] })])
                    .then(res => {
                    Object.assign(hashrateByPuid, res.data.data);
                })
                    .catch(error => {
                    console.log('算力请求错误日志: ' + error + ' ' + this.puids[key]);
                    save_log({ type: '请求算力', info: '算力请求错误日志: ' + error + ' ' + this.puids[key] });
                });
            }
            // 考虑到react-navgation 性能问题 ，做两档渲染 10s渲染一次， 20s 渲染一次
            timer = setTimeout(() => {
                runInAction(() => {
                    this.hashrateByPuid = hashrateByPuid;
                    this.loading = false;
                });
            }, 3500);
            timer = setTimeout(() => {
                runInAction(() => {
                    this.hashrateByPuid = hashrateByPuid;
                });
                clearTimeout(timer);
            }, 25000);
        });
        this.getAllUrlConfig = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.urlConfig();
            if (res && res.data) {
                let result = res.data;
                runInAction(() => {
                    this.allUrlConfig = result;
                    let coins = {};
                    result.map(item => coins[item.type.toLowerCase()] = item.config.coin_pic);
                    this.coins_pic = coins;
                });
                //异步存储币种全量 及对应的icon
                yield AsyncStorage.setItem(storage.COINS_PIC, JSON.stringify(this.coins_pic));
                yield AsyncStorage.setItem(storage.ALL_URL_CONFIG, JSON.stringify(this.allUrlConfig));
            }
        });
        this.isConnected = true;
        this.selectedTab = TabNav.Dashboard;
        this.lang = language.auto;
        this.puid = "";
        this.hashrateByPuid = {};
        this.accountList = [];
        this.HidAccountList = [];
        this.subAccount = '';
        this.coins_pic = {};
        this.loading = true;
        this.refreshing = false;
        this.isHidden = 0;
        this.puids = {};
        this.allUrlConfig = {};
    }
}
__decorate([
    observable
], AppStore.prototype, "isConnected", void 0);
__decorate([
    observable
], AppStore.prototype, "selectedTab", void 0);
__decorate([
    observable
], AppStore.prototype, "lang", void 0);
__decorate([
    observable
], AppStore.prototype, "puid", void 0);
__decorate([
    observable
], AppStore.prototype, "hashrateByPuid", void 0);
__decorate([
    observable
], AppStore.prototype, "accountList", void 0);
__decorate([
    observable
], AppStore.prototype, "HidAccountList", void 0);
__decorate([
    observable
], AppStore.prototype, "subAccount", void 0);
__decorate([
    observable
], AppStore.prototype, "coins_pic", void 0);
__decorate([
    observable
], AppStore.prototype, "loading", void 0);
__decorate([
    observable
], AppStore.prototype, "refreshing", void 0);
__decorate([
    observable
], AppStore.prototype, "isHidden", void 0);
__decorate([
    observable
], AppStore.prototype, "puids", void 0);
__decorate([
    observable
], AppStore.prototype, "allUrlConfig", void 0);
__decorate([
    action
], AppStore.prototype, "onChangeTab", void 0);
__decorate([
    action
], AppStore.prototype, "moreList", void 0);
__decorate([
    action
], AppStore.prototype, "getHashrate", void 0);
__decorate([
    action
], AppStore.prototype, "getAllUrlConfig", void 0);
//# sourceMappingURL=appStore.js.map