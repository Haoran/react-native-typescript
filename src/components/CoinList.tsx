import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {Flex} from 'antd-mobile-rn';
import adapt from '../interfaces/adapt'
import {inject, observer} from "mobx-react";
import {Icons} from './Icons';
import I18n from "../interfaces/i18n";

@inject('store')
@observer
export default class CoinList extends Component<any, any> {

    public store: any;
    static navigationOptions = {
        headerTitle: I18n.t('coins'),
        headerStyle: {
            backgroundColor: '#22A7F0',
            borderBottomWidth: 0,
            height: adapt.pxToDp(44)
        }
    }

    constructor(props: any) {
        super(props);
        this.store = this.props.store.welcome;
    }

    handleChangeCoin = (coinType: string) => {
        this.store.handleChangeCoin(coinType);
        this.props.navigation.goBack();
    }

    render() {
        const {multiCoins, coins_pic} = this.props.navigation.state.params;

        return (
            <View style={styles.container}>
                {
                    Object.keys(multiCoins).map(item => {
                        return (
                            <View style={styles.items} key={item}>
                                <Flex align="center" justify="center" direction="column" onPress={() => this.handleChangeCoin(item)} style={{width:'100%'}}>
                                    <View style={styles.rip}>
                                        <Icons uri={item in coins_pic ? coins_pic[item] : ''} width="30" height="30"/>
                                    </View>
                                    <Text style={styles.text}>{item.toUpperCase()}</Text>
                                </Flex>
                            </View>
                        )
                    })
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: "wrap",
    },
    items: {
        width: '33%',
        height: adapt.pxToDp(80),
        justifyContent: 'center',
        alignItems: "center",
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.4,
    },
    text: {
        marginTop: adapt.pxToDp(8),
        color: '#000000',
        fontSize: adapt.setSpText(14),
        textAlign: 'center'
    },
    rip: {
        width: adapt.pxToDp(30),
        height: adapt.pxToDp(30),
        borderRadius: adapt.pxToDp(15),
        overflow:'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
})