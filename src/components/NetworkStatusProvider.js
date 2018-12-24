var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { NetInfo } from 'react-native';
import { inject, observer } from "mobx-react";
let NetworkStatusProvider = class NetworkStatusProvider extends React.Component {
    constructor(props) {
        super(props);
        this.appStore = this.props.store.appStore;
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
            this.appStore.isConnected = isConnected;
        });
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', () => { });
    }
    render() {
        return this.props.children;
    }
};
NetworkStatusProvider = __decorate([
    inject('store'),
    observer
], NetworkStatusProvider);
export default NetworkStatusProvider;
//# sourceMappingURL=NetworkStatusProvider.js.map