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
import {AsyncStorage} from "react-native";
import {storage} from "../interfaces/storage";
import {Toast} from 'antd-mobile-rn';
import {toastError} from '../interfaces/utils'

export default class modifyAccount {
    @observable public accountInfo: any;
    @observable public destCoin: string;
    @observable public loading: boolean;
    @observable public timer: any;
    @observable public contactList: any;
    @observable public watchers: any;


    constructor() {
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

    @action public getAccountInfo = async (regionID, puid) => {
        try {
            this.loading = true;
            const res = await api.getAccountInfo(regionID, {puid: puid});
            if (res && res.data) {
                this.loading = false;
                runInAction(() => {
                    this.accountInfo = res.data.data;
                })
            }
        } catch (error) {
            this.loading = false;
        }
    }

    @action public changeSwitchCoin = (coin) => {
        this.destCoin = coin == this.destCoin ? "" : coin
    }

    @action public hideAccount = async (regionID, operate, puid) => {
        try {
            let back = true;
            const param = operate == 'set' ? {hidden_puid: puid} : {cancle_hidden_puid: puid}
            const res = await api.hideAccount(regionID, operate, param);
            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    back = true
                    if (operate == 'set') {
                        const hidden_puid = await api.getPuid();
                        puid == hidden_puid ? AsyncStorage.removeItem(storage.PUID) : null;
                    }
                }
                else {
                    toastError(result.err_msg);
                    back = false
                }
            }
            return back

        } catch (error) {
            Toast.info('提交失败 !!!', 1);
            return false
        }
    }


    @action public switchAccount = async (current_regionId, current_puid, current_mode) => {
        if (!this.destCoin) {
            Toast.info('请选择切换币种!', 1);
            return false
        }
        try {
            this.loading = true;
            let payload;
            const res = await api.switchAccount(current_regionId, {
                puid: current_puid,
                source: current_mode,
                dest: this.destCoin,
            })
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
    }

    @action public setAlertHashrate = async (regionId, puid, hashrate, enabled, unit) => {
        try {
            const res = await api.setAlertHashrate(regionId,
                {
                    puid: puid,
                    hashrate: hashrate,
                    enabled: enabled,
                    unit: unit
                }
            )

            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    Toast.success('提交成功 !!!', 1);
                }
                else {
                    toastError(result.err_msg)
                }
            }
        } catch (error) {
            Toast.info('提交失败 !!!', 1);
        }
    }

    @action public setAlertMiner = async (regionId, puid, miners, enabled) => {
        try {
            const res = await api.setAlertMiners(regionId,
                {
                    puid: puid,
                    miners: miners,
                    enabled: enabled,
                }
            )
            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    Toast.success('提交成功 !!!', 1);
                }
                else {
                    toastError(result.err_msg)
                }
            }
        } catch (error) {
            // console.log(error)
            Toast.info('提交失败 !!!', 1,);
        }
    }

    @action public setAlertInterval = async (regionId, puid, interval) => {
        try {
            const res = await api.setAlertInterval(regionId,
                {
                    puid: puid,
                    interval: interval,
                }
            )
            if (res && res.data) {
                const result = res.data;
                if (result.data && result.data.status) {
                    runInAction(() => {
                        this.accountInfo.alert.alert_interval = interval;
                    })
                    Toast.success('提交成功 !!!', 1);
                }
                else {
                    toastError(result.err_msg)
                }
            }
        } catch (error) {
            console.log(error);
            Toast.info('提交失败 !!!', 1,);
        }
    }

    @action public getContacts = async (regionId, puid) => {
        const res = await api.getContacts(regionId, {puid: puid})
        if (res && res.data) {
            runInAction(() => {
                this.contactList = res.data.data;
            })

        }
    }

    @action public setAlertContact = async (regionId, operateType, param) => {
        this.loading = true;
        let returnBack: boolean = false;
        try {
            const res = await api.setAlertContact(regionId, operateType, param);
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
            Toast.info('提交失败 !!!', 1,);
            return returnBack;
        }
    }

    @action public getWatchers = async (puid) => {
        const res = await api.getWatchers({puid: puid})
        if (res && res.data) {
            runInAction(() => {
                this.watchers = res.data.data;
            })

        }
    }

    @action public operateWatcher = async (operate, param) => {
        this.loading = true;
        let returnBack: boolean = false;
        try {
            const res = await api.operaterWatcher(operate, param)
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
    }


}