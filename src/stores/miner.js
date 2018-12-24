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
import { toastError } from "../interfaces/utils";
let timer;
export default class Miner {
    constructor() {
        this.getGroupList = (puid = this.puid) => __awaiter(this, void 0, void 0, function* () {
            this.minerLoading = true;
            this.puid = puid;
            try {
                const params = { page: 1, page_size: 52, puid: this.puid };
                const res = yield api.groupList(params);
                if (res && res.data) {
                    this.minerLoading = false;
                    runInAction(() => {
                        this.groupList = res.data.data.list;
                    });
                }
            }
            catch (error) {
                this.minerLoading = false;
            }
        });
        this.operateGroup = (operateType, params) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.operateGroup(operateType, Object.assign({}, params, { puid: this.puid }));
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        Toast.success('提交成功!', 2);
                        this.getGroupList();
                    }
                    else if (result.data && !result.data.status) {
                        Toast.info(result.data, 2);
                    }
                    else {
                        result.err_msg ? typeof result.err_msg == "object" ? toastError(result.err_msg) : Toast.info(result.err_msg, 2) : Toast.info('提交失败!', 2);
                    }
                }
            }
            catch (error) {
                console.log(error);
                Toast.info(error, 2);
            }
        });
        this.getWorkerList = (fields) => __awaiter(this, void 0, void 0, function* () {
            clearTimeout(timer);
            this.workerList = [];
            this.showFooter = 1;
            const params = Object.assign({}, fields, { puid: this.puid });
            try {
                const res = yield api.workerList(params);
                if (res && res.data) {
                    runInAction(() => {
                        res.data.data.data.map(item => item.checked = false); // add checked 字段
                        this.workerList = fields.page == 1 ? res.data.data.data : [...this.workerList, ...res.data.data.data];
                        this.showFooter = fields.page == 1 ? 0 : res.data.data.data.length > 0 ? 0 : 2;
                        timer = setTimeout(() => {
                            this.showFooter = 0;
                        }, 1000);
                    });
                }
            }
            catch (error) {
                Toast.info(error, 2);
            }
        });
        this.getSingleWorker = (id) => __awaiter(this, void 0, void 0, function* () {
            const res = yield api.singleWorker(id, { puid: this.puid });
            if (res && res.data) {
                runInAction(() => {
                    this.singleWorker = res.data.data.data;
                });
            }
        });
        this.operateWorker = (params) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield api.updateWorker(Object.assign({}, params, { puid: this.puid }));
                if (res && res.data) {
                    const result = res.data;
                    if (result.data && result.data.status) {
                        Toast.success('提交成功!', 2);
                    }
                    else {
                        result.err_msg ? Toast.info(result.err_msg, 2) : Toast.info('提交失败!', 2);
                    }
                }
            }
            catch (error) {
                Toast.info(error, 2);
            }
        });
        this.getSingleWorkerShareHistory = (id, dimension) => __awaiter(this, void 0, void 0, function* () {
            const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000);
            const params = {
                puid: this.puid,
                dimension: dimension,
                start_ts: start_ts,
                real_point: 1,
                count: dimension == '1h' ? "24" : "10",
            };
            try {
                const res = yield api.singleWorkerShareHistory(id, params);
                if (res && res.data) {
                    runInAction(() => {
                        this.singleWorkerShareHistory = res.data.data;
                    });
                }
            }
            catch (error) {
                runInAction(() => {
                    this.singleWorkerShareHistory = {
                        tickers: [],
                        shares_unit: 'G'
                    };
                });
            }
        });
        this.puid = "";
        this.gid = '-1';
        this.groupList = [];
        this.workerList = [];
        this.showFooter = 0;
        this.loading = false;
        this.singleWorker = {};
        this.minerLoading = false;
        this.singleWorkerShareHistory = {
            tickers: [],
            shares_unit: 'G'
        };
    }
}
__decorate([
    observable
], Miner.prototype, "puid", void 0);
__decorate([
    observable
], Miner.prototype, "gid", void 0);
__decorate([
    observable
], Miner.prototype, "groupList", void 0);
__decorate([
    observable
], Miner.prototype, "workerList", void 0);
__decorate([
    observable
], Miner.prototype, "singleWorker", void 0);
__decorate([
    observable
], Miner.prototype, "singleWorkerShareHistory", void 0);
__decorate([
    observable
], Miner.prototype, "loading", void 0);
__decorate([
    observable
], Miner.prototype, "minerLoading", void 0);
__decorate([
    observable
], Miner.prototype, "showFooter", void 0);
__decorate([
    action
], Miner.prototype, "getGroupList", void 0);
__decorate([
    action
], Miner.prototype, "operateGroup", void 0);
__decorate([
    action
], Miner.prototype, "getWorkerList", void 0);
__decorate([
    action
], Miner.prototype, "getSingleWorker", void 0);
__decorate([
    action
], Miner.prototype, "operateWorker", void 0);
__decorate([
    action
], Miner.prototype, "getSingleWorkerShareHistory", void 0);
//# sourceMappingURL=miner.js.map