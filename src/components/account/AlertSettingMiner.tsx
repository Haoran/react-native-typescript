import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import adapt from '../../interfaces/adapt'
import {Flex, List, WingBlank, WhiteSpace, Switch, Picker, InputItem} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";

const Item = List.Item;

@inject('store')
@observer
export default class Modify extends Component<any, any> {

    public store: any;
    @observable miner_alert: boolean;
    @observable miner_value: any;

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Alert Setting',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.alertChangeMiner()}>
                <Flex direction="row" style={{marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3)}}>
                    <Text style={{color: '#ffffff'}}>Save</Text>
                </Flex>
            </TouchableOpacity>
        ),
        headerStyle: {
            backgroundColor: '#22a7f0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        }
    });

    constructor(props: any) {
        super(props);
        const {miner_alert, miner_value} = this.props.navigation.state.params;
        this.miner_alert = miner_alert == 0 ? false : true;
        this.miner_value = miner_value;
        this.store = this.props.store.modifyAccount;
    }

    componentDidMount() {
        this.props.navigation.setParams({alertChangeMiner: this.alertChangeMiner});
    }

    alertChangeMiner = () => {
        const {regionId, puid} = this.props.navigation.state.params;
        this.store.setAlertMiner(regionId, puid, this.miner_value, this.miner_alert ? 1 : 0);
    }

    onSwitchChange = (value: boolean) => {
        this.miner_alert = value;
    }

    render() {

        return (
            <View style={styles.container}>
                <WhiteSpace size="lg"/>
                <List>
                    <Item
                        extra={
                            <Switch
                                checked={this.miner_alert}
                                onChange={this.onSwitchChange}
                            />
                        }>
                        Enable Active Miner Alert
                    </Item>
                </List>
                <WhiteSpace/>
                {
                    this.miner_alert ?
                        <List renderHeader={() => 'WARN ME WHEN MINER ≤'}>
                            <InputItem type="number"
                                       value={this.miner_value.toString()}
                                       onChangeText={(v) => this.miner_value = v}
                            >
                            </InputItem>
                        </List> : null
                }
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
    title: {
        flex: 0,
        fontSize: adapt.setSpText(16),
        fontWeight: 'bold',
        color: '#fff'
    },
})