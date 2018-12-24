import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Flex, WhiteSpace } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
const lang = "zh-cn";
export const NoMiner = (props) => {
    const { name, poolAddress } = props;
    return (React.createElement(Flex, { direction: "column", style: styles.contentContainer },
        React.createElement(Flex, { align: "center", justify: "center", style: styles.status },
            React.createElement(Text, { style: styles.text1 }, "\u6CA1\u6709\u68C0\u6D4B\u5230\u77FF\u673A")),
        React.createElement(Flex, { direction: "column", justify: "center", align: "start", style: styles.content },
            React.createElement(WhiteSpace, null),
            React.createElement(Text, { style: styles.text2 }, "\u5982\u4F55\u5C06\u77FF\u673A\u8FDE\u63A5\u5230\u77FF\u6C60"),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.text3 },
                poolAddress.region_name,
                "\u8282\u70B9\u6316\u77FF\u5730\u5740"),
            React.createElement(WhiteSpace, { size: "sm" }),
            poolAddress.config.map(item => {
                return (React.createElement(Text, { style: styles.text3, key: item }, item));
            }),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.text4 }, "\u77FF\u673A\u540D\u8BBE\u7F6E"),
            React.createElement(WhiteSpace, { size: "lg" }),
            React.createElement(Text, { style: styles.text5 }, "\u683C\u5F0F\uFF1A\u5B50\u8D26\u6237.ID"),
            React.createElement(WhiteSpace, null),
            React.createElement(Text, { style: styles.text5 },
                "\u4F8B\u5982\u4F60\u7684\u5B57\u8D26\u6237\u540D\u79F0\u662F: ",
                name,
                ", \u4F60\u53EF\u4EE5\u5C06\u591A\u53F0\u77FF\u673A\u4F9D\u6B21\u8BBE\u7F6E\u4E3A: ",
                name,
                ".001, ",
                name,
                ".002 ... \u4EE5\u6B64\u7C7B\u63A8! \u77FF\u673A\u5C06\u4F1A\u6309ID\u987A\u5E8F\u4F9D\u6B21\u6392\u5217\u3002"))));
};
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
    text4: {
        fontSize: adapt.pxToDp(13),
        color: '#666666',
    },
    text5: {
        fontSize: adapt.pxToDp(12),
        color: '#666666',
    }
});
//# sourceMappingURL=NoMiner.js.map