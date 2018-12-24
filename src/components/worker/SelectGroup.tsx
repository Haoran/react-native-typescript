import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView, DeviceEventEmitter
} from 'react-native';
import {Flex, ActivityIndicator, WingBlank, Modal, List, Button} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import {compare} from "../../interfaces/utils";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {inject, observer} from "mobx-react";

const Item = List.Item;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    static navigationOptions = {
        headerTitle: '选择分组',
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.miner;
    }

    componentWillMount() {
        this.store.getGroupList();
    }

    handleSelect = (v) => {
        const {worker_id} = this.props.navigation.state.params;
        DeviceEventEmitter.emit('selected', {worker_id: worker_id.toString(), group_id: v});
        this.props.navigation.goBack();
    }

    handleCreate = () => {
        Modal.prompt(
            '创建新分组',
            '请为此分组输入名称',
            (text: any) => {
                this.store.operateGroup('create', {group_name: text});
            },
            'default',
            '',
            ['名称']
        )
    }

    render() {
        const {worker_id, type} = this.props.navigation.state.params;
        const {groupList, workerList} = this.store;

        return (
            <View style={styles.container}>
                <Flex direction="row" justify="start" align="center" style={styles.miner}>
                    {
                        workerList.map(item => {
                            return (
                                item.checked || type ?
                                    <Button size="small" key={item.worker_id} disabled
                                            style={styles.text5}>{item.worker_name}</Button> : null
                            )
                        })
                    }
                </Flex>
                <Flex direction="row" justify="start" align="center" style={styles.count}>
                    <Text style={styles.text6}>{worker_id.length} 台矿机</Text>
                </Flex>

                <Flex direction="row" justify="start" align="center" style={styles.iconAdd}
                      onPress={() => this.handleCreate()}>
                    <FontAwesomeIcon name="plus-circle" size={20} color="#22A7F0"/>
                    <Text style={styles.text4}>Create a new group</Text>
                </Flex>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <List>
                        {
                            groupList.sort(compare("gid")).map(item => {
                                return (
                                    item.gid == 0 ? null :
                                        <Item arrow="horizontal" key={item.gid}
                                              onClick={() => this.handleSelect(item.gid)}>
                                            <Flex direction="row" justify="center" align="center">
                                                <Text style={styles.text1}>
                                                    {item.name == 'DEFAULT' ? '未分组' : item.name}
                                                </Text>
                                                <Text style={styles.text2}>
                                                    {item.shares_15m} {item.shares_unit}H/s
                                                </Text>
                                                <Text style={styles.text3}>
                                                    {item.workers_active}/{item.workers_total}
                                                </Text>
                                            </Flex>
                                        </Item>
                                )
                            })
                        }
                    </List>
                </ScrollView>
            </View>
        );
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
            backgroundColor: '#EFEFF4',
            flex: 1,
            width: '100%',
        },
        text1: {
            width: '35%',
            color: '#666666',
            fontSize: adapt.setSpText(14),
            fontFamily: "Helvetica Neue",
        },
        text2: {
            width: '35%',
            color: '#666666',
            textAlign: 'right',
            fontSize: adapt.setSpText(14),
            fontFamily: "Helvetica Neue",
        },
        text3: {
            width: '30%',
            color: '#666666',
            textAlign: 'right',
            paddingRight: adapt.pxToDp(10),
            fontSize: adapt.setSpText(14),
            fontFamily: "Helvetica Neue",
        },
        text4: {
            fontSize: adapt.setSpText(14),
            color: '#22A7F0',
            marginLeft: adapt.pxToDp(15),
            height: adapt.pxToDp(45),
            lineHeight: adapt.pxToDp(45),
        },
        unit: {
            color: '#868686',
            fontSize: adapt.setSpText(14),
            paddingTop: 0,
            marginLeft: adapt.pxToDp(3)
        },
        iconAdd: {
            paddingLeft: adapt.pxToDp(15),
            width: '100%',
            backgroundColor: '#F7F7F7',
        },
        miner: {
            width: '100%',
            padding: adapt.pxToDp(15),
            backgroundColor: '#F7F7F7',
        },
        count: {
            width: '100%',
            paddingLeft: adapt.pxToDp(15),
            paddingBottom: adapt.pxToDp(8),
            backgroundColor: '#F7F7F7',
            borderBottomColor: '#E5E5E5',
            borderBottomWidth: 0.5
        },
        text5: {
            paddingLeft: 5,
            paddingRight: 5,
            marginRight: adapt.pxToDp(10),
            height: adapt.pxToDp(28),
            // backgroundColor: 'rgba(228,228,229,1)',
            // borderRadius: 4
        },
        text6: {
            color: '#000000',
            fontSize: adapt.setSpText(12),
        }
    })
;




