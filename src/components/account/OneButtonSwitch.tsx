import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import {Icons} from '../../components/Icons';
import adapt from '../../interfaces/adapt'
import {NavigationActions, StackActions} from 'react-navigation'
import {Flex, List, WingBlank, WhiteSpace, ActivityIndicator, NoticeBar} from 'antd-mobile-rn';
import {inject, observer} from "mobx-react";
import {TabNav} from '../../interfaces/tabnav';
const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
export default class OneButtonSwitch extends Component<any, any> {

    public store: any;
    public appStore: any;
    public dashboard: any;
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'One-button switch',
        headerRight: (
            <TouchableOpacity onPress={() => navigation.state.params.switchAccount()}>
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
        this.appStore = this.props.store.appStore;
        this.dashboard = this.props.store.dashboard;
    }

    componentDidMount() {
        this.props.navigation.setParams({switchAccount: this.switchAccount});
    }

    switchAccount = () => {
        const {current_regionId, current_puid, current_mode} = this.props.navigation.state.params;
        this.store.switchAccount(current_regionId, current_puid, current_mode)
            .then(res => {
                if (res) {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'TabNav'})]
                    });
                    this.appStore.onChangeTab(TabNav.Dashboard);
                    this.dashboard.puid=res[0];
                    this.dashboard.regionID=res[1];
                    this.props.navigation.dispatch(resetAction);
                }
            })
    }

    handleSwitchCoin = (item) => {
        this.store.changeSwitchCoin(item)
    }

    render() {
        const {current_mode, support_coins} = this.props.navigation.state.params;
        const {destCoin, loading } = this.store;

        return (
            <View style={styles.container}>
                <ActivityIndicator text="正在加载..." toast animating={loading}/>
                <WhiteSpace/>
                <WingBlank>
                    <Text style={{color: '#8E8E93', fontSize: adapt.setSpText(13)}}>
                        Warning: Due to the special difficulty adjustment rule and currency fluctuation of Bitcoin
                        Cash，please use this function carefully！
                    </Text>
                </WingBlank>
                <WhiteSpace/>
                <List>
                    {
                        support_coins.map(item => {
                            return (
                                item != current_mode ?
                                    <Item
                                        key={item}
                                        extra={
                                            destCoin == item ?
                                                <Icons iconName="img_main_select" width="12" height="9"/> : null
                                        }
                                        onClick={() => {
                                            this.handleSwitchCoin(item)
                                        }}
                                    >
                                        {item.toUpperCase()}
                                    </Item> : null
                            )
                        })
                    }

                </List>
                <WhiteSpace/>
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