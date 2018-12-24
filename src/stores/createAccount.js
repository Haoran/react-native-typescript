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
export default class AppStore {
    constructor() {
        this.getCoinsPic = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.coins_pic();
            runInAction(() => {
                this.coins = res;
            });
        });
        this.getNodeList = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.allUrlConfig();
            runInAction(() => {
                this.nodeList = res;
            });
        });
        this.create = (regionID, regionName, workName, coinType, address) => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            try {
                const res = yield api.createAccount(regionID, {
                    "region_node": regionName,
                    "worker_name": workName,
                    "coin_type": coinType,
                    "bitcoin_address": address
                });
                // console.log(res)
                if (res.data.err_no != 0) {
                    this.loading = false;
                    this.waringDisplay = true;
                    for (let key in res.data.err_msg) {
                        this.waringText = res.data.err_msg[key];
                    }
                    return false;
                }
                else {
                    this.loading = false;
                    return [res.data.data.puid, res.data.data.region_id];
                    // console.log(res.data.data.puid)
                    // 异步存储token
                    // await AsyncStorage.setItem(storage.REGIONID, JSON.stringify(res.data.data.region_id));
                }
            }
            catch (error) {
                return false;
                this.loading = false;
                console.log(error);
            }
        });
        this.coins = {};
        this.nodeList = [];
        this.loading = false;
        this.waringText = '';
        this.waringDisplay = false;
        this.createSuccess = false;
    }
}
__decorate([
    observable
], AppStore.prototype, "coins", void 0);
__decorate([
    observable
], AppStore.prototype, "nodeList", void 0);
__decorate([
    observable
], AppStore.prototype, "loading", void 0);
__decorate([
    observable
], AppStore.prototype, "waringText", void 0);
__decorate([
    observable
], AppStore.prototype, "waringDisplay", void 0);
__decorate([
    observable
], AppStore.prototype, "timer", void 0);
__decorate([
    observable
], AppStore.prototype, "createSuccess", void 0);
__decorate([
    action
], AppStore.prototype, "getCoinsPic", void 0);
__decorate([
    action
], AppStore.prototype, "getNodeList", void 0);
__decorate([
    action
], AppStore.prototype, "create", void 0);
//# sourceMappingURL=createAccount.js.map