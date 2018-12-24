import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity, Clipboard
} from 'react-native';
import adapt from '../../interfaces/adapt';
import {Icons} from '../../components/Icons';
import {List, WingBlank, WhiteSpace, Toast} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";

const Item = List.Item;

export default class Modify extends Component<any, any> {

    public store: any;
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerStyle: {
            backgroundColor: '#22a7f0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
    }

    _setClipboardContent = async (v) => {
        Clipboard.setString(v);
        Toast.info('已复制到剪贴板!', 1);
    }

    render() {
        const {address, name} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <List renderHeader={() => name}>
                    <Item extra={
                        <TouchableOpacity onPress={() => this._setClipboardContent(address)}>
                            <Icons iconName="copy" width="20" height="20"/>
                        </TouchableOpacity>
                    }>
                        <Text style={{paddingRight:adapt.pxToDp(5),color:'#C7C7CD',fontSize:adapt.setSpText(16)}}>{ address }</Text>
                    </Item>
                </List>
                <WhiteSpace/>
                <WingBlank>
                    <Text style={{color: '#FF3B30', fontSize: adapt.setSpText(13)}}>
                        If you need to modify this address,please login on pool website,click ”Settings” at the top
                        right corner.
                    </Text>
                </WingBlank>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
})