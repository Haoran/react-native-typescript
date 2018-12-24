import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import adapt from '../../interfaces/adapt';
import {List, WingBlank, WhiteSpace, Flex, InputItem, Button} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';
import btnStyle from 'antd-mobile-rn/lib/button/style/index.native';

const Item = List.Item;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    @observable public note: string;
    @observable public countryName: string;
    @observable public country: string;
    @observable public code: string;
    @observable public phone: any;
    @observable public email: any;
    @observable public deleteLoading: boolean;
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.addContact()}>
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
        const {item} = this.props.navigation.state.params;

        this.store = this.props.store.modifyAccount;
        this.note = item ? item.note : "";
        this.code = item && item.region_code ? item.region_code : '86';
        this.phone = item ? item.phone : '';
        this.email = item ? item.email : '';

        const userCountryData = getAllCountries().filter(country => country.callingCode === this.code).pop();
        this.country = userCountryData.cca2;
        this.countryName = userCountryData.name.common;
        this.deleteLoading = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({addContact: this.addContact});
    }

    addContact = () => {
        const {regionId, puid, item} = this.props.navigation.state.params;
        if (!this.store.loading) {
            let operate = item ? 'update' : 'create'
            this.store.setAlertContact(regionId, operate, {
                puid: puid,
                note: this.note,
                email: this.email,
                region_code: this.code,
                phone: this.phone,
                id: item ? item.id : null
            }).then(res => {
                !item && res ? this.props.navigation.goBack() : null;
            })
        }

    }

    delete = () => {
        this.deleteLoading = true;
        const {regionId, puid, item} = this.props.navigation.state.params;
        this.store.setAlertContact(regionId, 'delete', {
            puid: puid,
            id: item.id
        }).then(res => {
            this.deleteLoading = false;
            res ? this.props.navigation.goBack() : null;
        })

    }

    updateCountryCode = (value) => {
        this.country = value.cca2;
        this.code = value.callingCode;
        this.countryName = value.name;
    }

    render() {
        const {item} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <WhiteSpace/>
                <List>
                    <InputItem placeholder="Contacter" value={this.note}
                               onChange={v => this.note = v}
                    >
                        Name
                    </InputItem>
                    <Item arrow="horizontal">
                        <CountryPicker
                            closeable
                            showCallingCode
                            filterable
                            filterPlaceholder="Country"
                            filterPlaceholderTextColor="rgba(0,0,0,0.4)"
                            onChange={(value) => this.updateCountryCode(value)}
                            cca2={this.country}
                        >
                            <Flex direction="row" align="center">
                                <Text style={{fontSize: 17, marginRight: adapt.pxToDp(25)}}>Country/Region</Text>
                                <Text style={{fontSize: 17, color: '#8E8E93'}}>{this.countryName}</Text>
                            </Flex>
                        </CountryPicker>
                    </Item>
                    <Item>
                        <Flex direction="row" align="center">
                            <Text style={{fontSize: 17, flex: 2}}>Phone Number</Text>
                            <Text style={{fontSize: 17, flex: 1}}>{'+' + this.code}</Text>
                            <View style={{flex: 2}}>
                                <TextInput placeholder="Optional"
                                           style={{fontSize: adapt.setSpText(17)}}
                                           onChangeText={(text) => this.phone = text}
                                           value={this.phone}
                                           keyboardType="numeric"
                                />
                            </View>
                        </Flex>
                    </Item>
                    <InputItem placeholder="Optional" value={this.email} onChange={v => this.email = v}>
                        Email
                    </InputItem>
                </List>

                {
                    item ?
                        <Button onPressOut={() => this.delete()}
                                style={styles.submit}
                                styles={_btnStyle} disabled={this.deleteLoading} loading={this.deleteLoading}
                        >
                            Delete Contact
                        </Button> : null

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
        color: '#FE3824',
        fontSize: adapt.setSpText(16)
    },
}
