import {Toast} from "antd-mobile-rn";
import React, {Component} from 'react';
import {AsyncStorage} from "react-native";
import {storage} from "./storage";

/**
 * 获取节点信息
 * 节点中英文名称
 **/

const url = {
    btc: 'https://m.btc.com/',
    bch: 'https://mbch.btc.com/',
    sbtc: 'http://block.superbtc.org/',
    ubtc: 'https://block.bitbank.com/',
    eth: 'https://eth.btc.com/#/',
    etc: 'http://gastracker.io/',
    dcr: 'https://mainnet.decred.org/',
}

// 保存日志 >1000条清空日志
export async function save_log(log) {
    const req = await AsyncStorage.getItem(storage.ERROR_LOG)
    let logs = req ? JSON.parse(req) : [];
    logs = logs.length >= 1000 ? [] : logs;
    logs.unshift(JSON.stringify(log));
    AsyncStorage.setItem(storage.ERROR_LOG, JSON.stringify(logs));
}


// 获取该节点第一个url
export function getUrlConfigByRegionID(allUrlConfig, region_id) {
    for (let i = 0; i < allUrlConfig.length; i++) {
        if (allUrlConfig[i].id == region_id) {
            return allUrlConfig[i].config;
            break;
        }
        if (i == allUrlConfig.length - 1) {
            return null
        }
    }
}

export function toastError(err_msg) {
    for (let key in err_msg) {
        Toast.info(err_msg[key], 2);
        return;
    }
}

export function formatCoin(v) {
    if (v == 0) {
        return 0;
    }
    else {
        return (v / Math.pow(10, 8)).toFixed(8);
    }
}

export function formatBigNum(v) {
    var unit = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
    var index = 0;

    if (v == 0 || v == "" || v == undefined) {
        v = 0;
    } else {
        while (v >= 1000) {
            v = v / 1000;
            index++;
        }
    }

    return parseFloat(v).toFixed(2) + ' ' + unit[index];
}

//数组对象排序
export function compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}


export function height(coin_type, height, is_uncle = false) {
    coin_type = coin_type.toLowerCase();
    if (!url[coin_type]) {
        return 'https//m.btc.com/notfound'
    }
    let Similar = coin_type;
    if (['etc', 'sbtc', 'dcr'].includes(coin_type)) {
        Similar = 'Similar'
    }
    switch (Similar) {
        case 'eth':
            return is_uncle ? url[coin_type] + 'uncle/blockinfo/' + height : url[coin_type] + 'blockinfo/' + height
            break;
        case 'ubtc':
            return url[coin_type] + 'height/ubtc/' + height;
            break;
        case 'Similar':
            return url[coin_type] + 'block/' + height;
            break;
        default:
            return url[coin_type] + height;
            break;
    }
}

export function address(coin_type, address) {
    coin_type = coin_type.toLowerCase();
    if (!url[coin_type]) {
        return 'https//m.btc.com/notfound'
    }
    let Similar = coin_type;
    if (['sbtc', 'dcr'].includes(coin_type)) {
        Similar = 'Similar'
    }
    switch (Similar) {
        case 'eth':
            return url[coin_type] + 'accountinfo/' + address;
            break;
        case 'ubtc':
            return url[coin_type] + 'address/ubtc/' + address;
            break;
        case 'Similar':
            return url[coin_type] + 'address/' + address;
            break;
        case 'etc':
            return url[coin_type] + 'addr/' + address;
            break;
        default:
            return url[coin_type] + address;
            break;
    }
}

export function txhash(coin_type, hash) {
    coin_type = coin_type.toLowerCase();
    if (!url[coin_type]) {
        return 'https//m.btc.com/notfound'
    }
    let Similar = coin_type;
    if (['eth', 'etc', 'sbtc', 'dcr'].includes(coin_type)) {
        Similar = 'Similar'
    }
    switch (Similar) {
        case 'eth':
            return url[coin_type] + 'txinfo/' + hash;
            break;
        case 'ubtc':
            return url[coin_type] + 'tx/ubtc/' + hash;
            break;
        case 'Similar':
            return url[coin_type] + 'tx/' + hash;
            break;
        default:
            return url[coin_type] + hash;
            break;
    }
}