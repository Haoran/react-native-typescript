import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import adapt from '../../interfaces/adapt';
import {List, WingBlank, WhiteSpace, Flex, InputItem, Button} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    @observable public note: string;

    static navigationOptions = ({navigation}) => ({
        headerTitle: "New Watcher",
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.addWatcher()}>
                <Flex direction="row" style={{marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3)}}>
                    <Text style={{color: '#ffffff'}}>Save</Text>
                </Flex>
            </TouchableOpacity>
        ),
        headerStyle: {
            backgroundColor: '#22a7f0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
        this.store = this.props.store.modifyAccount;
        this.note = "";
    }

    componentDidMount() {
        this.props.navigation.setParams({addWatcher: this.addWatcher});
    }

    addWatcher = () => {
        const {puid} = this.props.navigation.state.params;
        if (!this.store.loading) {
            this.store.operateWatcher('create', {
                puid: puid,
                note: this.note,
            }).then(res => {
                res ? this.props.navigation.goBack() : null;
            })
        }

    }


    render() {
        const {loading} = this.store
        return (
            <View style={styles.container}>
                <WhiteSpace/>
                <List>
                    <InputItem placeholder="Set a name" value={this.note}
                               onChange={v => this.note = v}
                    >
                        Name
                    </InputItem>
                </List>

                <Button onPressOut={() => this.addWatcher()}
                        style={styles.submit}
                        styles={_btnStyle} disabled={loading} loading={loading}
                >
                    Generate a new link
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
    },
})

const _btnStyle = {
    ...btnStyle,
    defaultRawText: {
        ...btnStyle.defaultRawText,
        color: '#22A7F0',
        fontSize: adapt.setSpText(16)
    },
}
