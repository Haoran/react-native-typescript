import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {WingBlank, WhiteSpace, Flex, ActivityIndicator, List, SegmentedControl} from 'antd-mobile-rn';
import adapt from "../interfaces/adapt";
import {inject, observer} from "mobx-react";
import {Icons} from '../components/Icons';
import {language} from '../interfaces/lang';
import I18n from "../interfaces/i18n";
import {TabNav} from "../interfaces/tabnav";

const Item = List.Item;
const Brief = Item.Brief;

@inject('store')
@observer
export default class App extends Component<any, any> {

    public store: any;

    static navigationOptions = {
        headerTitle: '语言设置',
        headerStyle: {
            backgroundColor: '#22A7F0',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    };

    constructor(props: any) {
        super(props);
        this.store = this.props.store.appStore;
    }

    componentWillMount() {

    }

    handleSelect = (item) => {
        this.store.lang = item;
        this.store.selectedTab=TabNav.Dashboard;
    }

    render() {
        const {lang} = this.store;

        return (
            <View style={styles.container}>
                <List style={{width:'100%'}}>
                    {
                        Object.keys(language).map(item => {
                            return (
                                <Item key={item}
                                      onClick={() => this.handleSelect(item)}
                                      extra={
                                          lang == item ?
                                              <Icons iconName="img_main_select" width="12" height="9"/> : null
                                      }
                                >
                                    {/*<Text>{I18n.t('greeting')}</Text>*/}
                                    {I18n.t(item)}
                                </Item>
                            )
                        })
                    }
                </List>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#EFEFF4',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: "wrap",
        paddingTop:adapt.pxToDp(20)
    },
})