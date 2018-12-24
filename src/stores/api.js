var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AsyncStorage } from "react-native";
import { storage } from '../interfaces/storage';
import env from '../interfaces/env';
import { Toast } from "antd-mobile-rn";
import { getUrlConfigByRegionID, save_log } from '../interfaces/utils';
import axios from "axios";
let lang = "en";
let regionUrl = '';
let region_endpoint = "";
let puid = "";
let regionID = "";
let allUrlConfig = {};
let http = resetHttp();
export default {
    updateHttpConfigLang: (_lang) => __awaiter(this, void 0, void 0, function* () {
        lang = _lang;
        http = resetHttp();
    }),
    //多币种图标(本地)
    coins_pic: () => __awaiter(this, void 0, void 0, function* () {
        const res = yield AsyncStorage.getItem(storage.COINS_PIC);
        return res ? JSON.parse(res) : null;
    }),
    //多节点 多币种配置(本地)
    allUrlConfig: () => __awaiter(this, void 0, void 0, function* () {
        const res = yield AsyncStorage.getItem(storage.ALL_URL_CONFIG);
        return res ? JSON.parse(res) : null;
    }),
    //多币种状态信息(公有)
    multiCoinStates: () => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(env.multiCoinStats);
    }),
    //多币种 多节点配置(公有)
    urlConfig: () => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(env.allUrlConfig);
    }),
    //节点stratum
    stratum_url: (params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/pool/url-config', { params });
    }),
    //矿池算力历史(公有)
    shareHistoryByCoinType: (domain, params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(domain + '/pool/share-history/merge', { params });
    }),
    //当前节点url
    regionEndpoint: () => __awaiter(this, void 0, void 0, function* () {
        return region_endpoint;
    }),
    moreListDash: (_puid = puid, _regionID = regionID) => __awaiter(this, void 0, void 0, function* () {
        yield getAccountConfig(_puid ? _puid : puid, _regionID ? _regionID : regionID);
        return yield http.get(regionUrl + '/account/sub-account/algorithms/morelist');
    }),
    //子账户list
    moreList: (params = {}) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/account/sub-account/algorithms/morelist', { params });
    }),
    //获取子账户算力
    hashrateByRegion: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/account/sub-account/hashrate-miners', { params });
    }),
    //创建子账户
    createAccount: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/account/sub-account/create', params);
    }),
    //用户收益状态
    earnStats: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/account/earn-stats', { params });
    }),
    //用户收益历史
    earnHistory: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/account/earn-history', { params });
    }),
    // 网络状态
    networkStatus: () => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/pool/status');
    }),
    //用户矿机整体状态
    workStats: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/worker/stats', { params });
    }),
    //用户信息
    getAccountInfo: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/account/info', { params });
    }),
    //一键切换
    switchAccount: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/change/hashrate', params);
    }),
    //修改报警算力
    setAlertHashrate: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/hashrate', params);
    }),
    //修改报警矿机数
    setAlertMiners: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/miners', params);
    }),
    //修改报警周期
    setAlertInterval: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/alert/setting/interval', params);
    }),
    //获取报警联系人
    getContacts: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/alert/contacts/my', { params });
    }),
    //操作报警联系人
    setAlertContact: (regionID, operateType, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.post(regionUrl + '/' + env.apiVersion + '/alert/contacts/' + operateType, params);
    }),
    //获取观察者账户
    getWatchers: (params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/account/watcher/list', { params });
    }),
    //操作观察者账户
    operaterWatcher: (operateType, params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.post(regionUrl + '/account/watcher/' + operateType, params);
    }),
    //隐藏子账户
    hideAccount: (regionID, operateType, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/' + env.apiVersion + '/account/hidden/' + operateType, { params });
    }),
    // 矿工算力历史
    WorkerShareHistory: (params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/worker/share-history', { params });
    }),
    // 矿工分组list
    groupList: (params) => __awaiter(this, void 0, void 0, function* () {
        yield getAccountConfig();
        return yield http.get(regionUrl + '/worker/groups', { params });
    }),
    operateGroup: (operateType, params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.post(regionUrl + '/groups/' + operateType, params);
    }),
    // 矿机list
    workerList: (params) => __awaiter(this, void 0, void 0, function* () {
        yield getAccountConfig();
        return yield http.get(regionUrl + '/worker', { params });
    }),
    //矿机信息更新
    updateWorker: (params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.post(regionUrl + '/worker/update', params);
    }),
    // 单台矿机数据
    singleWorker: (id, params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/worker/' + id, { params });
    }),
    //单个矿机的算力数据
    singleWorkerShareHistory: (id, params) => __awaiter(this, void 0, void 0, function* () {
        return yield http.get(regionUrl + '/worker/' + id + '/share-history', { params });
    }),
    //获取矿池爆块数据
    poolBlocks: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/public/' + env.apiVersion + '/pool/blocks/merge', { params });
    }),
    //获取矿池算力状态
    poolStats: (regionID) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/public/' + env.apiVersion + '/pool/stats/merge');
    }),
    //获取矿池算力历史
    poolShareHistory: (regionID, params) => __awaiter(this, void 0, void 0, function* () {
        const endpoint = getUrlConfigByRegionID(allUrlConfig, regionID);
        const regionUrl = endpoint ? endpoint.app_api_endpoint : null;
        return yield http.get(regionUrl + '/public/' + env.apiVersion + '/pool/share-history/merge', { params });
    }),
};
// 首次加载从本地读取 子账户、币种、节点信息
const getAccountConfig = (_puid = puid, _regionID = regionID) => __awaiter(this, void 0, void 0, function* () {
    const _auth = yield AsyncStorage.getItem(storage.AUTH);
    const _allUrlConfig = yield AsyncStorage.getItem(storage.ALL_URL_CONFIG);
    regionID = _regionID;
    puid = _puid;
    allUrlConfig = _allUrlConfig ? JSON.parse(_allUrlConfig) : "";
    const auth = _auth ? JSON.parse(_auth) : "";
    const urlConfig = allUrlConfig ? getUrlConfigByRegionID(allUrlConfig, regionID) : null;
    region_endpoint = `${urlConfig.app_api_endpoint}`;
    regionUrl = `${urlConfig.app_api_endpoint}/${env.apiVersion}`;
    http = resetHttp();
    http.interceptors.request.use(config => {
        config.headers.Authorization = 'Bearer ' + auth.token; //将token设置成请求头
        return config;
    });
});
function resetHttp() {
    http = axios.create({
        baseURL: '/',
        timeout: 30000,
        responseType: "json",
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    http.interceptors.request.use(config => {
        config.params = Object.assign({ lang: lang }, config.params);
        return config;
    });
    // http response 拦截器
    http.interceptors.response.use(response => {
        if (response.data.err_no === 20001) {
            console.log(response);
            Toast.info('Permission Failed!', 2);
            save_log({ type: 'Permission Failed 20001', info: response });
        }
        return Promise.resolve(response);
    }, error => {
        if (!error.response) {
            // Toast.offline('数据获取失败!', 2);
            return Promise.reject(error);
        }
        let errorLog = {};
        if (error.response) {
            errorLog = {
                type: 'response',
                date: error.response.headers.date,
                method: error.config.method,
                status: error.response.status,
                data: error.response.data,
                url: error.response.request.responseURL
            };
        }
        else {
            errorLog = {
                type: 'request',
                date: error.request.responseHeaders.Date,
                method: error.config.method,
                status: error.request.status,
                url: error.request.responseURL
            };
        }
        save_log(errorLog);
        return Promise.reject(error);
    });
    return http;
}
//# sourceMappingURL=api.js.map