import React, {Component} from 'react';
import {NetInfo, Platform} from 'react-native';
import {inject, observer} from "mobx-react";
import {Toast} from "antd-mobile-rn";

@inject('store')
@observer
export default class NetworkStatusProvider extends React.Component <any, any> {

    public appStore;

    constructor(props: any) {
        super(props);
        this.appStore = this.props.store.appStore;
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
            this.appStore.isConnected = isConnected;
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange',()=>{});
    }

    render() {
        return this.props.children;
    }
}