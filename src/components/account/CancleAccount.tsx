import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import {Flex, List, WhiteSpace, WingBlank, Picker, Switch} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import adapt from "../../interfaces/adapt";
import {observable} from "mobx";
import {DeviceEventEmitter} from 'react-native';

const Item = List.Item;

@inject('store')
@observer
export default class Setting extends React.Component<any, any> {

    public store: any;
    public appStore: any;
    @observable isHidden: boolean;
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.account.name + '@' + navigation.state.params.account.coin_type + '-' + navigation.state.params.account.region_text,
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
        this.store = this.props.store.modifyAccount;
        this.appStore = this.props.store.appStore;
        this.isHidden = this.props.navigation.state.params.account.is_hidden == 0 ? false : true;
    }

    onSwitchChange = (v, regionID, puid) => {
        this.isHidden = v;
        this.store.hideAccount(regionID, 'cancle', puid).then(res =>{
            if(res){
                DeviceEventEmitter.emit('onHiddenRefresh');
                this.props.navigation.goBack();
            }
            else{
                this.isHidden=true
            }
        })
    }

    render() {
        const {account} = this.props.navigation.state.params;
        return (
            <ScrollView style={styles.contentContainer} showsHorizontalScrollIndicator={false}>

                <WhiteSpace size="xl"/>
                <Item
                    extra={
                        <Switch
                            checked={this.isHidden}
                            onChange={v => this.onSwitchChange(v, account.region_id, account.puid)}
                        />
                    }>
                    Hide
                </Item>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#EFEFF4',
        flex: 2,
        width: '100%',
        // alignItems:'center'
    }
})