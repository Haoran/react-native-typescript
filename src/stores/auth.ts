import {
    observable,
    action,
    computed,
    reaction,
    runInAction
} from 'mobx';
import {AsyncStorage} from 'react-native';
import {storage} from '../interfaces/storage';
import env from '../interfaces/env'
import api from "./api";
import {Toast} from "antd-mobile-rn";

export default class Auth {
    @observable shake: boolean;
    @observable isLogin;
    @observable auth;
    @observable login;
    @observable register;
    @observable tokenUrl;

    constructor() {
        this.shake = false;
        this.auth = "";
        this.login = env.poolAppLogin;
        this.register = env.poolAppRegister;
        this.tokenUrl = env.tokenUrl;
        this.isLogin= "init";
    }

    @action public updateShake = async (shake: boolean) => {
        runInAction(() => {
            this.shake = shake;
        })
    }

    // 登录成功 获得token
    @action public setAuthToken = async (auth) => {
        this.auth = auth;
        this.isLogin= true;
    }


    // asyncStorage 获取token
    @action public getAuthToken = async () => {
        const TokenString = await AsyncStorage.getItem(storage.AUTH);

        if (TokenString && JSON.parse(TokenString).hasOwnProperty('uid') && JSON.parse(TokenString).hasOwnProperty('token')) {
            this.auth = JSON.parse(TokenString);
            this.isLogin=true;
        }else{
            this.isLogin=false;
        }
    }


    // 退出 清除token
    @action public logout = async () => {
        // await AsyncStorage.removeItem(storage.AUTH);
        this.isLogin=false;
        this.auth = "";
    }

}

