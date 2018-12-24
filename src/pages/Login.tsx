import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    WebView,
} from 'react-native';
import {inject, observer} from "mobx-react";
import {NavigationActions, StackActions} from 'react-navigation'
import adapt from "../interfaces/adapt";
import {TabNav} from '../interfaces/tabnav';
import {storage} from "../interfaces/storage";
import {Toast} from "antd-mobile-rn";
import I18n from "../interfaces/i18n";

@inject('store')
@observer
export default class Login extends Component<any, any> {

    public store: any;
    public appStore: any;
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name == 'login' ? I18n.t('login_sign_in_title') : I18n.t('login_sign_up_title'),
        headerStyle: {
            backgroundColor: '#0288d1',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
        this.store = this.props.store.auth;
        this.appStore = this.props.store.appStore;
    }


    handleMessage = (e) => {

        this.appStore.onChangeTab(TabNav.Dashboard);

        if (e && e.nativeEvent.data) {
            this.handleToken(e.nativeEvent.data);
        }
        else {
            this.props.navigation.goBack();
        }

    }

    handleToken = async (token) => {

        // 清除路由历史 并且跳转到dashboard
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'TabNav'})]
        });

        const errs = await AsyncStorage.setItem(storage.AUTH, token);
        if (errs) {
            Toast.info(I18n.t('login_lose_efficacy'), 2);
            this.props.navigation.goBack();
        }
        else {
            console.log(I18n.t('login_sign_up_failure'))
            this.store.setAuthToken(token);
            this.props.navigation.dispatch(resetAction);
        }
    }

    injectJS() {
        const {tokenUrl} = this.store;

        let jsCode = `
            let locationUrl=window.location.href;
            if(locationUrl=='${tokenUrl}'){
                sendData();
                setTimeout(() => {
                    window.location.href='https://i.btc.com/cas/logout';
                },1500)
            }
          
            function sendData() {
                window.postMessage( JSON.stringify(token));
            }
            `

        return jsCode;  // js注入
    }

    render() {
        const {params} = this.props.navigation.state;
        const {login, register} = this.store;
        return (
            <View style={styles.container}>
                <WebView
                    scalesPageToFit={true}
                    source={{
                        uri: params.name == 'login' ? login : register,
                        method: 'GET',
                        headers: {'Cache-Control': 'no-cache'}
                    }}
                    style={{width: adapt.screenW(), height: adapt.screenH()}}
                    onMessage={(e) => {
                        this.handleMessage(e)
                    }}  //接受来自web消息
                    javaScriptEnabled={true}
                    injectedJavaScript={this.injectJS()}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                >
                </WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
