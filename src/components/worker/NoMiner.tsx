import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import {Flex, WhiteSpace, List} from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";


const lang = "zh-cn";

export const NoMiner = (props: any) => {

    const {name, poolAddress} = props;

    return (
        <Flex direction="column" style={styles.contentContainer}>
            <Flex align="center" justify="center" style={styles.status}>
                <Text style={styles.text1}>没有检测到矿机</Text>
            </Flex>
            <Flex direction="column" justify="center" align="start" style={styles.content}>
                <WhiteSpace/>
                <Text style={styles.text2}>如何将矿机连接到矿池</Text>
                <WhiteSpace size="lg"/>
                <Text style={styles.text3}>{poolAddress.region_name}节点挖矿地址</Text>
                <WhiteSpace size="sm"/>
                {
                    poolAddress.config.map(item => {
                        return (
                            <Text style={styles.text3} key={item}>
                                {item}
                            </Text>
                        )

                    })
                }
                <WhiteSpace size="lg"/>
                <Text style={styles.text4}>矿机名设置</Text>
                <WhiteSpace size="lg"/>
                <Text style={styles.text5}>
                    格式：子账户.ID
                </Text>
                <WhiteSpace />
                <Text style={styles.text5}>
                    例如你的字账户名称是: {name}, 你可以将多台矿机依次设置为: {name}.001, {name}.002 ... 以此类推!
                    矿机将会按ID顺序依次排列。
                </Text>
            </Flex>
        </Flex>
    );

}

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%'
    },
    status: {
        width: '100%',
        backgroundColor: '#22A7F0',
        height: adapt.pxToDp(44),
    },
    text1: {
        fontSize: adapt.pxToDp(16),
        color: '#ffffff',
        fontWeight: 'bold'
    },
    content: {
        backgroundColor: '#ffffff',
        width: '100%',
        padding: adapt.pxToDp(15)
    },
    text2: {
        fontSize: adapt.pxToDp(15),
        color: '#666666',
        fontWeight: 'bold'
    },
    text3: {
        fontSize: adapt.pxToDp(14),
        color: '#666666',
        marginTop: adapt.pxToDp(5)
    },
    text4:{
        fontSize: adapt.pxToDp(13),
        color: '#666666',
    },
    text5:{
        fontSize: adapt.pxToDp(12),
        color: '#666666',
    }
});




