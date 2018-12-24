import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import {Flex, ActivityIndicator, List} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import {Icons} from '../Icons';
import {compare} from "../../interfaces/utils";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Item = List.Item;
const Brief = Item.Brief;


export const SortListDrop = (props: any) => {

    const {sortKey, handleSort, asc} = props;

    const sortList = [
        {
            name: '日算力 低到高',
            key: 'shares_1d',
            asc: '0'
        },
        {
            name: '日算力 高到低',
            key: 'shares_1d',
            asc: '1'
        },
        {
            name: '矿机名 正序',
            key: 'worker_name',
            asc: '0'
        },
        {
            name: '矿机名 倒序',
            key: 'worker_name',
            asc: '1'
        },
        {
            name: '拒绝率 低到高',
            key: 'reject_percent',
            asc: '0'
        },
        {
            name: '最后在线时间',
            key: 'last_share_time',
            asc: '0'
        }
    ]
    return (
        <View style={styles.contentContainer} onStartShouldSetResponder={() => handleSort("hidden")}>
            <View style={styles.blackBoard}>
                <View style={styles.view}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <List>
                            {
                                sortList.map(item => {
                                    return (
                                        <Item key={item.name} onClick={() => handleSort(item)}>
                                            <Flex direction="row" justify="start" align="center">
                                                <Text style={styles.text1}>
                                                    {item.name == 'DEFAULT' ? '未分组' : item.name}
                                                </Text>
                                                {
                                                    sortKey == item.key && asc == item.asc ?
                                                        <Icons iconName="img_main_select" width="12" height="9"
                                                               style={{flex: 1}}/>
                                                        : null
                                                }
                                            </Flex>
                                        </Item>)
                                })
                            }
                        </List>
                    </ScrollView>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    contentContainer: {
        position: 'absolute',
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 98
    },
    blackBoard: {
        backgroundColor: 'rgba(0,0,0,0.4);',
        marginTop: adapt.pxToDp(44),
        height: '100%',
        width: '100%',
    },
    view: {
        maxHeight: adapt.pxToDp(300),
        backgroundColor: "#ffffff",
        zIndex: 99,

    },
    text1: {
        flex: 9,
        width: '45%',
        color: '#666666',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    unit: {
        color: '#868686',
        fontSize: adapt.setSpText(14),
        paddingTop: 0,
        marginLeft: adapt.pxToDp(3)
    },
    iconDrop: {
        marginRight: adapt.pxToDp(10),
    },
});




