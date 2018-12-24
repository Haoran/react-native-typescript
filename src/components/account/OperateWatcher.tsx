import React, {Component} from 'react';
import {
    Clipboard,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Icons} from '../../components/Icons';
import adapt from '../../interfaces/adapt';
import {List, WingBlank, WhiteSpace, Flex, InputItem, Button, Picker, Toast} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';

const Item = List.Item;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    @observable public note: string;
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
        const {item} = this.props.navigation.state.params;

        this.store = this.props.store.modifyAccount;
        this.note = item ? item.note : "";
    }

    delete = () => {
        const {item} = this.props.navigation.state.params;
        this.store.operateWatcher('delete', {
            puid: item.puid,
            watcher_id: item.id
        }).then(res => {
            res ? this.props.navigation.goBack() : null;
        })
    }

    _setClipboardContent = async (v) => {
        Clipboard.setString(v);
        Toast.info('已复制到剪贴板!', 1);
    }

    render() {
        const {item} = this.props.navigation.state.params;
        const {loading} = this.store
        return (
            <View style={styles.container}>
                <WhiteSpace/>
                <List>
                    <Item>
                        <Flex direction="row" align="center">
                            <Text style={{fontSize: 17, marginRight: adapt.pxToDp(20)}}>Name</Text>
                            <Text style={{fontSize: 17}}>{item.note}</Text>
                        </Flex>
                    </Item>
                    <Item extra={
                        <TouchableOpacity onPress={() => this._setClipboardContent(item.redirect)}>
                            <Icons iconName="copy" width="20" height="20"/>
                        </TouchableOpacity>
                    }>
                        <Flex direction="row" align="center">
                            <Text style={{fontSize: 17, marginRight: adapt.pxToDp(20)}}>Link</Text>
                            <Text style={{fontSize: 13, color: '#C7C7CD'}}>{item.redirect}</Text>
                        </Flex>
                    </Item>
                </List>
                <WhiteSpace size="xl"/>
                <WhiteSpace/>
                <Flex direction="row" align="center" justify="center">
                    <QRCode
                        value={item.redirect}
                        size={150}
                    />
                </Flex>
                <WhiteSpace/>
                <Button onPressOut={() => this.delete()}
                        style={styles.submit}
                        styles={_btnStyle} disabled={loading} loading={loading}
                >
                    Delete Link
                </Button>
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
    submit: {
        marginTop: adapt.pxToDp(40),
        backgroundColor: '#FFFFFF',
        width: adapt.screenW(),
        height: adapt.pxToDp(40),
        borderWidth: 0
    }
})

const _btnStyle = {
    ...btnStyle,
    defaultRawText: {
        ...btnStyle.defaultRawText,
        color: '#FE3824',
        fontSize: adapt.setSpText(16)
    },
}
