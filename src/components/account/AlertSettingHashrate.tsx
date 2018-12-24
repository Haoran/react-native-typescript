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
import {Icons} from "../Icons";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Item = List.Item;

@inject('store')
@observer
export default class Modify extends Component<any, any> {

    public store: any;
    @observable hashrate_alert: boolean;
    @observable units: any;
    @observable hashrate_value: any;
    @observable hashrate_unit: any;

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Alert Setting',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.alertChangeHashrate()}>
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
        const {hashrate_alert, hashrate_value, hashrate_unit} = this.props.navigation.state.params;
        this.hashrate_alert = hashrate_alert == 0 ? false : true;
        this.hashrate_value = hashrate_value;
        this.hashrate_unit = hashrate_unit;
        this.units = [
            {label: 'PH/s', value: 'P',},
            {label: 'TH/s', value: 'T',},
            {label: 'GH/s', value: 'G',},
            {label: 'MH/s', value: 'M',},
        ];
        this.store = this.props.store.modifyAccount;
    }

    componentDidMount() {
        this.props.navigation.setParams({alertChangeHashrate: this.alertChangeHashrate});
    }

    alertChangeHashrate = () => {
        const {regionId, puid} = this.props.navigation.state.params;
        this.store.setAlertHashrate(regionId, puid, this.hashrate_value, this.hashrate_alert ? 1 : 0, this.hashrate_unit);
    }

    onSwitchChange = (value: boolean) => {
        this.hashrate_alert = value;
    }

    render() {

        return (
            <View style={styles.container}>
                <WhiteSpace size="lg"/>
                <List>
                    <Item
                        extra={
                            <Switch
                                checked={this.hashrate_alert}
                                onChange={this.onSwitchChange}
                            />
                        }>
                        Enable Active Miner Alert
                    </Item>
                </List>
                <WhiteSpace/>
                {
                    this.hashrate_alert ?
                        <List renderHeader={() => 'WARN ME WHEN HASHRATE ≤'}>
                            <InputItem type="number"
                                       value={this.hashrate_value.toString()}
                                       onChangeText={(v) => this.hashrate_value = v}
                                       extra={
                                           <Picker
                                               okText="确定"
                                               dismissText="取消"
                                               data={this.units}
                                               cols={1}
                                               value={[this.hashrate_unit]}
                                               onOk={(v: any) => {
                                                   this.hashrate_unit = v[0]
                                               }}
                                           >
                                               <CustomChildren/>
                                           </Picker>
                                       }
                            >
                            </InputItem>
                        </List> : null
                }
            </View>
        )
    }
}


const CustomChildren = (props: any) => (
    <TouchableOpacity onPress={props.onClick}>
        <View style={{height: adapt.pxToDp(44), flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#000000', fontSize: adapt.setSpText(17)}}>{props.extra}</Text>
            <FontAwesomeIcon name="caret-down" size={22} color="#000000" style={styles.iconDrop}/>
        </View>
    </TouchableOpacity>
);

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
    iconDrop: {
        marginLeft: adapt.pxToDp(3),
    },
})