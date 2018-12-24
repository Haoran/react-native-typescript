import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import {TabNav} from '../../interfaces/tabnav';
import {Icons} from '../../components/Icons';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator, List, SwipeAction, Modal, Toast} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import {inject, observer} from "mobx-react";
import {compare} from "../../interfaces/utils";
import loadingStyle from 'antd-mobile-rn/lib/activity-indicator/style/index.native';

const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;
    public appStore: any;
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Groups',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.addGroup()}>
                <Flex direction="row" style={{marginRight: adapt.pxToDp(10), marginTop: adapt.pxToDp(3)}}>
                    <Icons iconName="icon_header_add" width="16" height="16"/>
                </Flex>
            </TouchableOpacity>
        ),
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
        this.store = this.props.store.miner;
        this.appStore = this.props.store.appStore;
    }

    componentWillMount() {
        this.store.getGroupList();
    }

    componentDidMount() {
        this.props.navigation.setParams({addGroup: this.addGroup});
    }

    addGroup = () => {
        Modal.prompt(
            '创建新分组',
            '请为此分组输入名称',
            (text: any) => {
                this.store.operateGroup('create', {group_name: text.trim()});
            },
            'default',
            '',
            ['名称']
        )
    }

    changeTab = (v) => {
        this.store.gid = v;
        this.appStore.onChangeTab(TabNav.Miner);
        this.props.navigation.goBack();
        this.store.getWorkerList(
            {
                status: "active",
                group: v,
                page: 1,
                page_size: 20,
                filter: '',
                order_by: "worker_name",
                asc: 0
            }
        )
    }

    render() {

        const {groupList, minerLoading} = this.store;
        const {navigation} = this.props;

        const right = (item) => {
            return [
                {
                    text: '重命名',
                    onPress: () => {
                        console.log(item.gid)
                        Modal.prompt(
                            `将${item.name} 重命名为`,
                            '请为此分组输入名称',
                            (text: any) => {
                                if(item.name.trim()==text.trim()){
                                    Toast.info('提交成功!', 1);
                                    return;
                                }
                                this.store.operateGroup('update/' + item.gid, {group_name: text.trim()});
                            },
                            'default',
                            '',
                            ['名称']
                        )
                    },
                    style: {backgroundColor: '#C7C7CC', color: '#ffffff'},
                },
                {
                    text: '删除',
                    onPress: () => {
                        Modal.alert('删除分组', `${item.name} 分组将被移除，该分组下所有子账户将会被移入 "未分组"`, [
                            {
                                text: '取消', onPress: () => {
                                }, style: {color: '#C7C7CC'}
                            },
                            {
                                text: '确定', onPress: () => {
                                    this.store.operateGroup('delete/' + item.gid, {})

                                }
                            },
                        ]);

                    },
                    style: {backgroundColor: '#FF3B30', color: '#ffffff'},
                },
            ]
        }

        return (
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {
                    minerLoading ?
                        <ActivityIndicator text="正在加载..." animating={minerLoading} styles={_loadingStyle}/>
                        :
                        <List>
                            {
                                groupList.sort(compare("gid")).map((item, index) => {
                                    return (
                                        <SwipeAction
                                            disabled={item.gid == -1 || item.gid == 0 ? true : false}
                                            autoClose
                                            key={item.gid}
                                            style={{backgroundColor: 'transparent'}}
                                            right={right(item)}
                                        >
                                            <Item arrow="horizontal" onClick={() => this.changeTab(item.gid)}>
                                                <Brief style={{
                                                    fontSize: adapt.setSpText(14),
                                                    color: "#6D6D72"
                                                }}>
                                                    {item.name == 'DEFAULT' ? '未分组' : item.name}
                                                </Brief>
                                                <Flex direction="row" justify="start" align="center"
                                                      style={{
                                                          paddingTop: adapt.pxToDp(9),
                                                          paddingBottom: adapt.pxToDp(4)
                                                      }}>
                                                    <Flex direction="row" justify="start" align="center"
                                                          style={{width: adapt.pxToDp(135)}}>
                                                        <Text style={styles.text}>{item.shares_15m}</Text>
                                                        <Brief style={styles.unit}>{item.shares_unit}H/s</Brief>
                                                    </Flex>
                                                    <Flex direction="row" justify="start" align="center">
                                                        <Text style={styles.text}>
                                                            {item.workers_active}/{item.workers_total}
                                                        </Text>
                                                        <Brief style={styles.unit}>Miners</Brief>
                                                    </Flex>
                                                </Flex>

                                            </Item>
                                        </SwipeAction>
                                    )
                                })
                            }
                        </List>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#ffffff',
        flex: 1,
        width: '100%',
    },
    text: {
        // width: adapt.pxToDp(120),
        color: '#666666',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    unit: {
        color: '#868686',
        fontSize: adapt.setSpText(14),
        paddingTop: 0,
        marginLeft: adapt.pxToDp(3)
    }
})

const _loadingStyle = {
    ...loadingStyle,
    spinner: {
        ...loadingStyle.spinner,
        height: adapt.pxToDp(50),
        backgroundColor: '#ffffff'
    },
}
