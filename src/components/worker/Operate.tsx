import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import {Flex, ActivityIndicator, List} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";

const Item = List.Item;
const Brief = Item.Brief;


export const Operate = (props: any) => {

    const { handleOperate} = props;

    const sortList = [
        {
            name: '移动至...',
            key: '0',
        },
        {
            name: '移动全部',
            key: '2',
        },
        {
            name: '删除',
            key: '1',
        },
        {
            name: '删除全部',
            key: '3',
        }
    ]

    return (
        <View style={styles.contentContainer} onStartShouldSetResponder={() => handleOperate("hidden")}>
            <View style={styles.blackBoard}>
                <View style={styles.view}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <List>
                            {
                                sortList.map(item => {
                                    return (
                                        <Item key={item.name} onClick={() => handleOperate(item.key)}>
                                            <Flex direction="row" justify="start" align="center">
                                                <Text style={styles.text1}>{item.name}</Text>
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
    blackBoard:{
        backgroundColor: 'rgba(0,0,0,0.6);',
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




