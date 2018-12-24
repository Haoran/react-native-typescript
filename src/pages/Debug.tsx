import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import adapt from "../interfaces/adapt";
import {WingBlank, WhiteSpace, Flex, ActivityIndicator, List, SwipeAction, Modal} from 'antd-mobile-rn';
import {AsyncStorage} from "react-native";
import {storage} from "../interfaces/storage";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import {NavBar} from '../components/NavBar';
import {navType} from "../interfaces/navType";

const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
export default class App extends Component<any, any> {

    @observable public logs: [];
    public store;

    constructor(props: any) {
        super(props);
        this.logs = [];
        this.store = this.props.store.auth;
    }

    componentWillMount() {
        this.getLog();
    }

    updateShake() {
        this.store.updateShake(false);
    }

    async getLog() {
        const req = await AsyncStorage.getItem(storage.ERROR_LOG);
        this.logs = req ? JSON.parse(req) : [];

    }

    navConfig = {
        leftContent: {
            type: navType.text,
            text: 'Back'
        },
        title: {
            type: navType.text,
            text: 'Debug'

        },
        rightContent: {
            type: navType.empty,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}></View>
                <View style={styles.tabNav}>
                    <NavBar
                        title={this.navConfig.title}
                        leftContent={this.navConfig.leftContent}
                        rightContent={this.navConfig.rightContent}
                        handleClick={(type) => type == 'left' ? this.updateShake() :null}
                    />
                </View>
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {
                        this.logs.map((item, index) => {
                            return (
                                <View style={styles.view} key={index}>
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },
    contentContainer: {
        backgroundColor: '#ffffff',
        flex: 1,
        width: '100%',
    },
    top: {
        width: '100%',
        backgroundColor: '#22a7f0',
        paddingTop: adapt.isIphonex() ? adapt.pxToDp(40) : adapt.pxToDp(20),
    },
    tabNav: {
        height: adapt.pxToDp(44),
        width: '100%',
        backgroundColor: '#22a7f0',
    },

    view: {
        backgroundColor: '#f5f5f5',
        margin: adapt.pxToDp(10),
        padding: adapt.pxToDp(8)
    },
    text: {
        color: '#030303',
        fontSize: adapt.setSpText(14),
    },
})
