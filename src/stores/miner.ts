import {observable, action, runInAction, when} from 'mobx';
import api from "./api";
import {AsyncStorage} from "react-native";
import {storage} from "../interfaces/storage";
import {Toast} from "antd-mobile-rn";
import {toastError} from "../interfaces/utils";

let timer;
export default class Miner {
    @observable public puid: string;
    @observable public gid: string;
    @observable public groupList: any;
    @observable public workerList: any;
    @observable public singleWorker: any;
    @observable public singleWorkerShareHistory: any;
    @observable public loading: boolean;
    @observable public minerLoading: boolean;
    @observable public showFooter: number; // 0 上拉加载更多  1:正在加载中  2: 没有更多数据了

    constructor() {
        this.puid = "";
        this.gid = '-1';
        this.groupList = [];
        this.workerList = [];
        this.showFooter = 0;
        this.loading = false;
        this.singleWorker = {};
        this.minerLoading=false;
        this.singleWorkerShareHistory = {
            tickers: [],
            shares_unit: 'G'
        };
    }

    @action public getGroupList = async (puid=this.puid) => {
        this.minerLoading=true;
        this.puid =puid;
        try {
            const params = {page: 1, page_size: 52, puid: this.puid}
            const res = await api.groupList(params);
            if (res && res.data) {
                this.minerLoading = false;
                runInAction(() => {
                    this.groupList = res.data.data.list;
                })
            }
        }
        catch (error) {
            this.minerLoading=false;
        }
    }

    @action public operateGroup = async (operateType, params) => {
        try {
            const res = await api.operateGroup(operateType, {...params, ...{puid: this.puid}});
            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    Toast.success('提交成功!', 2);
                    this.getGroupList();
                }
                else if(result.data && !result.data.status){
                    Toast.info(result.data, 2);
                }
                else {
                    result.err_msg ? typeof result.err_msg =="object" ? toastError(result.err_msg) : Toast.info(result.err_msg, 2) : Toast.info('提交失败!', 2);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.info(error,2)
        }
    }

    @action public getWorkerList = async (fields) => {
        clearTimeout(timer);
        this.workerList = [];
        this.showFooter = 1;
        const params = {...fields, ...{puid: this.puid}};
        try{
            const res = await api.workerList(params);
            if (res && res.data) {
                runInAction(() => {
                    res.data.data.data.map(item => item.checked = false);  // add checked 字段
                    this.workerList = fields.page == 1 ? res.data.data.data : [...this.workerList, ...res.data.data.data];
                    this.showFooter = fields.page == 1 ? 0 : res.data.data.data.length > 0 ? 0 : 2;
                    timer = setTimeout(() => {
                        this.showFooter = 0;
                    }, 1000)
                })
            }
        }catch(error){
            Toast.info(error,2)
        }

    }

    @action public getSingleWorker = async (id) => {
        const res = await api.singleWorker(id, {puid: this.puid});
        if (res && res.data) {
            runInAction(() => {
                this.singleWorker = res.data.data.data;
            })
        }
    }

    @action public operateWorker = async (params) => {
        try {
            const res = await api.updateWorker({...params, ...{puid: this.puid}});
            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    Toast.success('提交成功!', 2);
                }
                else {
                    result.err_msg ? Toast.info(result.err_msg, 2) : Toast.info('提交失败!', 2);
                }
            }
        } catch (error) {
            Toast.info(error,2);
        }
    }

    @action public getSingleWorkerShareHistory = async (id, dimension) => {
        const start_ts = dimension == '1h' ? Math.floor((Date.now() - 24 * 1 * 3600 * 1000) / 1000) : Math.floor((Date.now() - 24 * 30 * 3600 * 1000) / 1000);
        const params = {
            puid: this.puid,
            dimension: dimension,
            start_ts: start_ts,
            real_point: 1,
            count: dimension == '1h' ? "24" : "10",
        }
        try {
            const res = await api.singleWorkerShareHistory(id, params);
            if (res && res.data) {
                runInAction(() => {
                    this.singleWorkerShareHistory = res.data.data;
                })
            }
        } catch (error) {
            runInAction(() => {
                this.singleWorkerShareHistory = {
                    tickers: [],
                    shares_unit: 'G'
                }
            })
        }
    }
}