import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import adapt from '../../interfaces/adapt';
import {Icons} from '../../components/Icons';
import {List, WingBlank, WhiteSpace, Flex} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";

const Item = List.Item;

@inject('store')
@observer
export default class Modify extends Component<any, any> {

    public store: any;
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Alert Contact',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.navigate('OperateContact',{
                regionId: navigation.state.params.regionId,
                puid: navigation.state.params.puid,
                name: 'Add Contact'
            })}>
                <Flex direction="row" style={{marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3)}}>
                    <Icons iconName="icon_header_add" width="16" height="16"/>
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
    }

    componentWillMount() {
        const {regionId, puid} = this.props.navigation.state.params;
        this.store.getContacts(regionId, puid)
    }

    render() {
        const {contactList} = this.store;
        const {regionId, puid} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <WhiteSpace/>
                <List>
                    {
                        contactList.map(item => {
                            return (
                                <Item arrow="horizontal" key={item.id}
                                      onClick={() => this.props.navigation.navigate('OperateContact', {
                                          regionId: regionId,
                                          puid: puid,
                                          name: item.note,
                                          item: item,
                                      })}
                                >
                                    {item.note}
                                </Item>
                            )
                        })
                    }
                </List>
                <WhiteSpace/>
                <List>
                    <Item arrow="horizontal"
                          onClick={() => this.props.navigation.navigate('OperateContact', {
                              regionId: regionId,
                              puid: puid,
                              name: 'Add Contact'
                          })}
                    >
                        Add New...
                    </Item>
                </List>
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