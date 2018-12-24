import {
    observable,
    action,
    computed,
    runInAction,
    reaction,
    autorun,
    when
} from 'mobx';
import api from './api';
import {storage} from "../interfaces/storage";
import {AsyncStorage} from "react-native";

export default class AppStore {
    @observable public coins: any;
    @observable public nodeList: any;
    @observable public loading: boolean;
    @observable public waringText: string;
    @observable public waringDisplay: boolean;
    @observable public timer: any;
    @observable public createSuccess: boolean;

    constructor() {
        this.coins = {};
        this.nodeList = [];
        this.loading = false;
        this.waringText = '';
        this.waringDisplay = false;
        this.createSuccess = false;
    }


    @action public getCoinsPic = async () => {
        const res = await api.coins_pic();

        runInAction(() => {
            this.coins = res;
        })

    }

    @action public getNodeList = async () => {
        const res = await api.allUrlConfig();
        runInAction(() => {
            this.nodeList = res;
        })
    }

    @action public create = async (regionID, regionName, workName, coinType, address) => {
        this.loading = true;
        try {
            const res = await api.createAccount(regionID, {
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
            console.log(error)
        }
    }
}