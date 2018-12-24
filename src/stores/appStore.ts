import {
    observable,
    action,
    runInAction,
    reaction,
    autorun,
    when
} from 'mobx';
import {TabNav} from '../interfaces/tabnav';
import api from './api';
import {Toast} from "antd-mobile-rn";
import {storage} from "../interfaces/storage";
import {AsyncStorage} from "react-native";
import {save_log} from '../interfaces/utils';
import {language} from '../interfaces/lang';

export default class AppStore {
    @observable public isConnected: boolean;
    @observable public selectedTab: TabNav;
    @observable public lang: string;
    @observable public puid: any;
    @observable public hashrateByPuid: any;
    @observable public accountList: any;
    @observable public HidAccountList: any;
    @observable public subAccount: string;
    @observable public coins_pic: any;
    @observable public loading: boolean;  //loading 加载
    @observable public refreshing: boolean; // 下拉刷新
    @observable public isHidden: number;
    @observable public puids: any;
    @observable public allUrlConfig: any;

    constructor() {
        this.isConnected = true;
        this.selectedTab = TabNav.Dashboard;
        this.lang=language.auto;
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

    @action public onChangeTab = (tabName: TabNav) => {
        this.selectedTab = tabName;
    }

    @action public moreList = async () => {
        try {
            this.loading = this.refreshing ? false : true;
            const res = await api.moreList({is_hidden: this.isHidden});
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
                        })
                    })
                })

                // 当前子账户排在首位
                const accounts = accountList.filter(item => item.name != accountName);
                accounts.unshift(currentAccount);

                runInAction(() => {
                    this.isHidden == 0 ? this.accountList = accounts : this.HidAccountList = accountList;
                    this.isHidden == 1 ? this.loading = false : null;
                    this.refreshing = false;
                })
            }
        }
        catch {
            this.loading = false;
            this.refreshing = false;
            Toast.info('数据异常!', 1);
        }

    }

    @action public getHashrate = async () => {
        let hashrateByPuid = {};
        let timer;

        for (let key in this.puids) {
            Promise.race([api.hashrateByRegion(key, {puids: this.puids[key]})])
                .then(res => {
                    Object.assign(hashrateByPuid, res.data.data);
                })
                .catch(error => {
                    console.log('算力请求错误日志: ' + error + ' ' + this.puids[key]);
                    save_log({type: '请求算力', info: '算力请求错误日志: ' + error + ' ' + this.puids[key]});
                })
        }

        // 考虑到react-navgation 性能问题 ，做两档渲染 10s渲染一次， 20s 渲染一次
        timer = setTimeout(() => {
            runInAction(() => {
                this.hashrateByPuid = hashrateByPuid;
                this.loading = false
            })
        }, 3500)

        timer = setTimeout(() => {
            runInAction(() => {
                this.hashrateByPuid = hashrateByPuid;
            })
            clearTimeout(timer)
        }, 25000)
    }


    @action public getAllUrlConfig = async () => {
        const res = await api.urlConfig();
        if (res && res.data) {

            let result = res.data;
            runInAction(() => {
                this.allUrlConfig = result;
                let coins = {};
                result.map(item => coins[item.type.toLowerCase()] = item.config.coin_pic);
                this.coins_pic = coins;
            })

            //异步存储币种全量 及对应的icon
            await AsyncStorage.setItem(storage.COINS_PIC, JSON.stringify(this.coins_pic));
            await AsyncStorage.setItem(storage.ALL_URL_CONFIG, JSON.stringify(this.allUrlConfig));
        }
    }


}
