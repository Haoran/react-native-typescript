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
import { AsyncStorage } from 'react-native';
import { storage } from '../interfaces/storage';
import env from '../interfaces/env';
export default class Auth {
    constructor() {
        this.updateShake = (shake) => __awaiter(this, void 0, void 0, function* () {
            runInAction(() => {
                this.shake = shake;
            });
        });
        // 登录成功 获得token
        this.setAuthToken = (auth) => __awaiter(this, void 0, void 0, function* () {
            this.auth = auth;
            this.isLogin = true;
        });
        // asyncStorage 获取token
        this.getAuthToken = () => __awaiter(this, void 0, void 0, function* () {
            const TokenString = yield AsyncStorage.getItem(storage.AUTH);
            if (TokenString && JSON.parse(TokenString).hasOwnProperty('uid') && JSON.parse(TokenString).hasOwnProperty('token')) {
                this.auth = JSON.parse(TokenString);
                this.isLogin = true;
            }
            else {
                this.isLogin = false;
            }
        });
        // 退出 清除token
        this.logout = () => __awaiter(this, void 0, void 0, function* () {
            // await AsyncStorage.removeItem(storage.AUTH);
            this.isLogin = false;
            this.auth = "";
        });
        this.shake = false;
        this.auth = "";
        this.login = env.poolAppLogin;
        this.register = env.poolAppRegister;
        this.tokenUrl = env.tokenUrl;
        this.isLogin = "init";
    }
}
__decorate([
    observable
], Auth.prototype, "shake", void 0);
__decorate([
    observable
], Auth.prototype, "isLogin", void 0);
__decorate([
    observable
], Auth.prototype, "auth", void 0);
__decorate([
    observable
], Auth.prototype, "login", void 0);
__decorate([
    observable
], Auth.prototype, "register", void 0);
__decorate([
    observable
], Auth.prototype, "tokenUrl", void 0);
__decorate([
    action
], Auth.prototype, "updateShake", void 0);
__decorate([
    action
], Auth.prototype, "setAuthToken", void 0);
__decorate([
    action
], Auth.prototype, "getAuthToken", void 0);
__decorate([
    action
], Auth.prototype, "logout", void 0);
//# sourceMappingURL=auth.js.map