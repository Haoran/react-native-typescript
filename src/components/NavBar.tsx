import React from 'react';
import adapt from '../interfaces/adapt'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {List, Flex, WingBlank, Picker} from 'antd-mobile-rn';
import {Icons} from './Icons';
import {navType} from '../interfaces/navType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const CustomChildren = (props: any) => (
    <TouchableOpacity onPress={props.onClick}>
        <View style={{height: adapt.pxToDp(44), flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 1}}>{props.children}</Text>
            <Text style={styles.title}>{props.extra}</Text>
            <FontAwesomeIcon name="caret-down" size={16} color="#fff" style={styles.iconDrop}/>
        </View>
    </TouchableOpacity>
);


export const NavBar = (props: any) => {
    const {leftContent, title, rightContent, handleClick} = props;

    return (
        <WingBlank size="lg">
            <Flex justify="between" direction="row" wrap="nowrap" align="center" style={styles.container}>
                <Flex.Item style={styles.itemLeft} onPress={() => handleClick('left')}>
                    {
                        leftContent.type && leftContent.type == navType.icon ?
                            <FontAwesomeIcon name="angle-left" size={20} color="#fff" style={styles.iconDrop}/> :
                            leftContent.type == navType.text ?
                                <Text style={styles.text}>{leftContent.text}</Text> : null
                    }
                </Flex.Item>
                <Flex.Item style={styles.itemTitle}>
                    {
                        title.type && title.type == navType.drop ?
                            <View>
                                <Picker
                                    title=""
                                    okText="确定"
                                    dismissText="取消"
                                    data={title.data}
                                    cols={1}
                                    value={[title.value]}
                                    onChange={(v: any) => {
                                        handleClick('title', v)
                                    }}
                                    onOk={(v: any) => {
                                        handleClick('title', v)
                                    }}
                                >
                                    <CustomChildren/>
                                </Picker>
                            </View> :
                            title.type == navType.text ?
                                <Text style={[styles.text, styles.title]}>{title.text}</Text> :
                                <View>{title.element}</View>
                    }
                </Flex.Item>
                <Flex.Item style={styles.rightItem} onPress={() => {
                    handleClick('right')
                }}>
                    {
                        rightContent.type && rightContent.type == navType.icon ?
                            <Icons iconName={rightContent.iconName} width="20" height="15"/> :
                            rightContent.type == navType.text ?
                                <Text style={styles.text}>{rightContent.text}</Text> :
                                rightContent.type == navType.element ?
                                    <View>{rightContent.element}</View> : null
                    }
                </Flex.Item>
            </Flex>
        </WingBlank>
    );
};


const styles = StyleSheet.create({
        container: {
            // color:'#fff',
        },

        itemLeft: {
            height: adapt.pxToDp(44),
            justifyContent: 'center',
            alignItems: 'flex-start',
        },

        itemTitle: {
            height: adapt.pxToDp(44),
            flex: 4,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
        },

        iconDrop: {
            marginLeft: adapt.pxToDp(5),
        },

        rightItem: {
            height: adapt.pxToDp(44),
            justifyContent: 'center',
            alignItems: 'flex-end',
        },

        title: {
            flex: 0,
            fontSize: adapt.setSpText(17),
            fontWeight: 'bold',
            color: '#fff'
        },

        titleContent: {
            // height: adapt.pxToDp(35),
            width: 200,
            backgroundColor: '#22a7f0',
            borderBottomWidth: 0,
        },

        text: {
            flex: 1,
            textAlign: 'center',
            color: "#fff",
            lineHeight: adapt.pxToDp(44),
            fontWeight: '400',
            fontSize: adapt.setSpText(16),
        },

    })
;