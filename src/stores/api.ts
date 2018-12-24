import {AsyncStorage} from "react-native";
import {storage} from '../interfaces/storage';
import env from '../interfaces/env';
import {Toast} from "antd-mobile-rn";
import {getUrlConfigByRegionID, save_log} from '../interfaces/utils';
import axios from "axios";

let lang: string = "en";
let regionUrl: string = '';
let region_endpoint: string = "";
let puid: string = "";
let regionID: string = "";
let allUrlConfig: any = {};

let http = resetHttp();

export default {
    updateHttpConfigLang: async (_lang) => {
        lang = _lang;
        http = resetHttp();
    },

    //多币种图标(本地)
    coins_pic: async () => {
        const res = await AsyncStorage.getItem(storage.COINS_PIC);
        return res ? JSON.parse(res) : null;
    },

    //多节点 多币种配置(本地)
    allUrlConfig: async () => {
        const res = await AsyncStorage.getItem(storage.ALL_URL_CONFIG);
        return res ? JSON.parse(res) : null;
    },

    //多币种状态信息(公有)
    multiCoinStates: async () => {
        return await http.get(env.multiCoinStats);
    },

    //多币种 多节点配置(公有)
    urlConfig: async () => {
        return await http.get(env.allUrlConfig);
    },

    //节点stratum
    stratum_url: async (params) => {
        return await http.get(regionUrl + '/pool/url-config', {params});
    },

    //矿池算力历史(公有)
    shareHistoryByCoinType: async (domain, params) => {
        return await http.get(domain + '/pool/share-history/merge', {params});
    },

    //当前节点url
    regionEndpoint: async () => {
        return region_endpoint;
    },

    moreListDash: async (_puid = puid, _regionID = regionID) => {
        await getAccountConfig(_puid ? _puid : puid, _regionID ? _regionID : regionID);
        return await http.get(regionUrl + '/account/sub-account/algorithms/morelist');
    },

    //子账户list
    moreList: async (params = {}) => {
        return await http.get(regionUrl + '/account/sub-account/algorithms/morelist', {params});
    },

    //获取子账户算力
    hashrateByRegion: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/account/sub-account/hashrate-miners', {params});
    },

    //创建子账户
    createAccount: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/account/sub-account/create', params);
    },

    //用户收益状态
    earnStats: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/account/earn-stats', {params});
    },

    //用户收益历史
    earnHistory: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/account/earn-history', {params});
    },

    // 网络状态
    networkStatus: async () => {
        return await http.get(regionUrl + '/pool/status');
    },

    //用户矿机整体状态
    workStats: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/worker/stats', {params});
    },

    //用户信息
    getAccountInfo: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/account/info', {params});
    },

    //一键切换
    switchAccount: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/change/hashrate', params);
    },

    //修改报警算力
    setAlertHashrate: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/hashrate', params);
    },

    //修改报警矿机数
    setAlertMiners: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/miners', params);
    },

    //修改报警周期
    setAlertInterval: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/interval', params);
    },

    //获取报警联系人
    getContacts: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/alert/contacts/my', {params});
    },

    //操作报警联系人
    setAlertContact: async (regionID, operateType, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.post(regionUrl + '/' + env.apiVersion + '/alert/contacts/' + operateType, params);
    },

    //获取观察者账户
    getWatchers: async (params) => {
        return await http.get(regionUrl + '/account/watcher/list', {params});
    },

    //操作观察者账户
    operaterWatcher: async (operateType, params) => {
        return await http.post(regionUrl + '/account/watcher/' + operateType, params);
    },

    //隐藏子账户
    hideAccount: async (regionID, operateType, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/' + env.apiVersion + '/account/hidden/' + operateType, {params});
    },

    // 矿工算力历史
    WorkerShareHistory: async (params) => {
        return await http.get(regionUrl + '/worker/share-history', {params});
    },

    // 矿工分组list
    groupList: async (params) => {
        await getAccountConfig();
        return await http.get(regionUrl + '/worker/groups', {params});
    },

    operateGroup: async (operateType, params) => {
        return await http.post(regionUrl + '/groups/' + operateType, params);
    },

    // 矿机list
    workerList: async (params) => {
        await getAccountConfig();
        return await http.get(regionUrl + '/worker', {params});
    },

    //矿机信息更新
    updateWorker: async (params) => {
        return await http.post(regionUrl + '/worker/update', params);
    },

    // 单台矿机数据
    singleWorker: async (id, params) => {
        return await http.get(regionUrl + '/worker/' + id, {params});
    },

    //单个矿机的算力数据
    singleWorkerShareHistory: async (id, params) => {
        return await http.get(regionUrl + '/worker/' + id + '/share-history', {params});
    },

    //获取矿池爆块数据
    poolBlocks: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/public/' + env.apiVersion + '/pool/blocks/merge', {params});
    },

    //获取矿池算力状态
    poolStats: async (regionID) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/public/' + env.apiVersion + '/pool/stats/merge');
    },

    //获取矿池算力历史
    poolShareHistory: async (regionID, params) => {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return await http.get(regionUrl + '/public/' + env.apiVersion + '/pool/share-history/merge', {params});
    },

}


// 首次加载从本地读取 子账户、币种、节点信息
const getAccountConfig = async (_puid = puid, _regionID = regionID) => {
    const _auth = await AsyncStorage.getItem(storage.AUTH);
    const _allUrlConfig = await AsyncStorage.getItem(storage.ALL_URL_CONFIG);

    regionID = _regionID;
    puid = _puid;
    allUrlConfig = _allUrlConfig ? JSON.parse(_allUrlConfig) : "";
    const auth = _auth ? JSON.parse(_auth) : "";
    const urlConfig = allUrlConfig ? getUrlConfigByRegionID(allUrlConfig, regionID) : null;
    region_endpoint = `${urlConfig.app_api_endpoint}`;
    regionUrl = `${urlConfig.app_api_endpoint}/${env.apiVersion}`;

    http = resetHttp();
    http.interceptors.request.use(
        config => {
            config.headers.Authorization = 'Bearer ' + auth.token;  //将token设置成请求头
            return config;
        }
    );

}

function resetHttp() {
    http = axios.create({
        baseURL: '/',
        timeout: 30000,
        responseType: "json",
        withCredentials: true, // 是否允许带cookie这些
        headers: {
            'Content-Type': 'application/json'
        }
    });
    http.interceptors.request.use(
        config => {
            config.params={...{lang:lang},...config.params}
            return config;
        }
    );
    // http response 拦截器
    http.interceptors.response.use(
        response => {
            if (response.data.err_no === 20001) {
                console.log(response);
                Toast.info('Permission Failed!', 2);
                save_log({type: 'Permission Failed 20001', info: response})
            }
            return Promise.resolve(response);
        },
        error => {
            if (!error.response) {
                // Toast.offline('数据获取失败!', 2);
                return Promise.reject(error);
            }
            let errorLog = {}
            if (error.response) {
                errorLog = {
                    type: 'response',
                    date: error.response.headers.date,
                    method: error.config.method,
                    status: error.response.status,
                    data: error.response.data,
                    url: error.response.request.responseURL
                }
            }
            else {
                errorLog = {
                    type: 'request',
                    date: error.request.responseHeaders.Date,
                    method: error.config.method,
                    status: error.request.status,
                    url: error.request.responseURL
                }
            }
            save_log(errorLog)
            return Promise.reject(error);
        }
    );

    return http;
}