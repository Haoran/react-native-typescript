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
import { AsyncStorage } from "react-native";
import { storage } from "../interfaces/storage";
import { Toast } from 'antd-mobile-rn';
import { toastError } from '../interfaces/utils';
export default class modifyAccount {
    constructor() {
        this.getAccountInfo = (regionID, puid) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.loading = true;
                const res = yield api.getAccountInfo(regionID, { puid: puid });
                if (res && res.data) {
                    this.loading = false;
                    runInAction(() => {
                        this.accountInfo = res.data.data;
                    });
                }
            }
            catch (error) {
                this.loading = false;
            }
        });
        this.changeSwitchCoin = (coin) => {
            this.destCoin = coin == this.destCoin ? "" : coin;
        };
        this.hideAccount = (regionID, operate, puid) => __awaiter(this, void 0, void 0, function* () {
            try {
                let back = true;
                const param = operate == 'set' ? { hidden_puid: puid } : { cancle_hidden_puid: puid };
                const res = yield api.hideAccount(regionID, operate, param);
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        back = true;
                        if (operate == 'set') {
                            const hidden_puid = yield api.getPuid();
                            puid == hidden_puid ? AsyncStorage.removeItem(storage.PUID) : null;
                        }
                    }
                    else {
                        toastError(result.err_msg);
                        back = false;
                    }
                }
                return back;
            }
            catch (error) {
                Toast.info('提交失败 !!!', 1);
                return false;
            }
        });
        this.switchAccount = (current_regionId, current_puid, current_mode) => __awaiter(this, void 0, void 0, function* () {
            if (!this.destCoin) {
                Toast.info('请选择切换币种!', 1);
                return false;
            }
            try {
                this.loading = true;
                let payload;
                const res = yield api.switchAccount(current_regionId, {
                    puid: current_puid,
                    source: current_mode,
                    dest: this.destCoin,
                });
                if (res && res.data) {
                    this.loading = false;
                    Toast.success('切换成功！', 1);
                    payload = [res.data.data.dest_puid, res.data.data.dest_region_id];
                }
                return payload;
            }
            catch (error) {
                this.loading = false;
                return false;
            }
        });
        this.setAlertHashrate = (regionId, puid, hashrate, enabled, unit) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.setAlertHashrate(regionId, {
                    puid: puid,
                    hashrate: hashrate,
                    enabled: enabled,
                    unit: unit
                });
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        Toast.success('提交成功 !!!', 1);
                    }
                    else {
                        toastError(result.err_msg);
                    }
                }
            }
            catch (error) {
                Toast.info('提交失败 !!!', 1);
            }
        });
        this.setAlertMiner = (regionId, puid, miners, enabled) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.setAlertMiners(regionId, {
                    puid: puid,
                    miners: miners,
                    enabled: enabled,
                });
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        Toast.success('提交成功 !!!', 1);
                    }
                    else {
                        toastError(result.err_msg);
                    }
                }
            }
            catch (error) {
                // console.log(error)
                Toast.info('提交失败 !!!', 1);
            }
        });
        this.setAlertInterval = (regionId, puid, interval) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.setAlertInterval(regionId, {
                    puid: puid,
                    interval: interval,
                });
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        runInAction(() => {
                            this.accountInfo.alert.alert_interval = interval;
                        });
                        Toast.success('提交成功 !!!', 1);
                    }
                    else {
                        toastError(result.err_msg);
                    }
                }
            }
            catch (error) {
                console.log(error);
                Toast.info('提交失败 !!!', 1);
            }
        });
        this.getContacts = (regionId, puid) => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.getContacts(regionId, { puid: puid });
            if (res && res.data) {
                runInAction(() => {
                    this.contactList = res.data.data;
                });
            }
        });
        this.setAlertContact = (regionId, operateType, param) => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            let returnBack = false;
            try {
                const res = yield api.setAlertContact(regionId, operateType, param);
                this.loading = false;
                const result = res.data;
                switch (operateType) {
                    case 'create':
                        if (result.data && result.data.status) {
                            returnBack = true;
                            Toast.success('提交成功 !!!', 2);
                            this.getContacts(regionId, param.puid);
                        }
                        else {
                            toastError(result.err_msg);
                        }
                        break;
                    case 'update':
                        if (result.data && result.data.status) {
                            Toast.success('提交成功 !!!', 1);
                            this.getContacts(regionId, param.puid);
                        }
                        else {
                            toastError(result.err_msg);
                        }
                        break;
                    case 'delete':
                        if (result.data && result.data.status) {
                            returnBack = true;
                            Toast.success('提交成功 !!!', 2);
                            this.getContacts(regionId, param.puid);
                        }
                        else {
                            toastError(result.err_msg);
                        }
                        break;
                    default:
                        break;
                }
                return returnBack;
            }
            catch (error) {
                this.loading = false;
                Toast.info('提交失败 !!!', 1);
                return returnBack;
            }
        });
        this.getWatchers = (puid) => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.getWatchers({ puid: puid });
            if (res && res.data) {
                runInAction(() => {
                    this.watchers = res.data.data;
                });
            }
        });
        this.operateWatcher = (operate, param) => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            let returnBack = false;
            try {
                const res = yield api.operaterWatcher(operate, param);
                this.loading = false;
                const result = res.data;
                switch (operate) {
                    case 'create':
                        if (result.data && result.data.status) {
                            returnBack = true;
                            Toast.success('提交成功 !!!', 2);
                            this.getWatchers(param.puid);
                        }
                        else {
                            toastError(result.err_msg);
                        }
                        break;
                    case 'delete':
                        if (result.data && result.data.status) {
                            returnBack = true;
                            Toast.success('提交成功 !!!', 2);
                            this.getWatchers(param.puid);
                        }
                        else {
                            toastError(result.err_msg);
                        }
                        break;
                    default:
                        break;
                }
                return returnBack;
            }
            catch (error) {
                this.loading = false;
                Toast.info('提交失败 !!!', 1);
                return returnBack;
            }
        });
        this.accountInfo = {
            contact: {
                mail: "",
                phone: {
                    country: "",
                    number: "",
                },
            },
            address: '',
            alert: {
                hashrate_value: 0,
                hashrate_unit: 'G',
                miner_value: 0,
                alert_interval: 0,
                hashrate_alert: 0,
                miner_alert: 0
            }
        };
        this.destCoin = "";
        this.loading = false;
        this.contactList = [];
        this.watchers = [];
    }
}
__decorate([
    observable
], modifyAccount.prototype, "accountInfo", void 0);
__decorate([
    observable
], modifyAccount.prototype, "destCoin", void 0);
__decorate([
    observable
], modifyAccount.prototype, "loading", void 0);
__decorate([
    observable
], modifyAccount.prototype, "timer", void 0);
__decorate([
    observable
], modifyAccount.prototype, "contactList", void 0);
__decorate([
    observable
], modifyAccount.prototype, "watchers", void 0);
__decorate([
    action
], modifyAccount.prototype, "getAccountInfo", void 0);
__decorate([
    action
], modifyAccount.prototype, "changeSwitchCoin", void 0);
__decorate([
    action
], modifyAccount.prototype, "hideAccount", void 0);
__decorate([
    action
], modifyAccount.prototype, "switchAccount", void 0);
__decorate([
    action
], modifyAccount.prototype, "setAlertHashrate", void 0);
__decorate([
    action
], modifyAccount.prototype, "setAlertMiner", void 0);
__decorate([
    action
], modifyAccount.prototype, "setAlertInterval", void 0);
__decorate([
    action
], modifyAccount.prototype, "getContacts", void 0);
__decorate([
    action
], modifyAccount.prototype, "setAlertContact", void 0);
__decorate([
    action
], modifyAccount.prototype, "getWatchers", void 0);
__decorate([
    action
], modifyAccount.prototype, "operateWatcher", void 0);
//# sourceMappingURL=modifyAccount.js.map