import React from 'react';
import adapt from '../interfaces/adapt';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Flex, WingBlank, Picker } from 'antd-mobile-rn';
import { Icons } from './Icons';
import { navType } from '../interfaces/navType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const CustomChildren = (props) => (React.createElement(TouchableOpacity, { onPress: props.onClick },
    React.createElement(View, { style: { height: adapt.pxToDp(44), flexDirection: 'row', alignItems: 'center' } },
        React.createElement(Text, { style: { flex: 1 } }, props.children),
        React.createElement(Text, { style: styles.title }, props.extra),
        React.createElement(FontAwesomeIcon, { name: "caret-down", size: 16, color: "#fff", style: styles.iconDrop }))));
export const NavBar = (props) => {
    const { leftContent, title, rightContent, handleClick } = props;
    return (React.createElement(WingBlank, { size: "lg" },
        React.createElement(Flex, { justify: "between", direction: "row", wrap: "nowrap", align: "center", style: styles.container },
            React.createElement(Flex.Item, { style: styles.itemLeft, onPress: () => handleClick('left') }, leftContent.type && leftContent.type == navType.icon ?
                React.createElement(FontAwesomeIcon, { name: "angle-left", size: 20, color: "#fff", style: styles.iconDrop }) :
                leftContent.type == navType.text ?
                    React.createElement(Text, { style: styles.text }, leftContent.text) : null),
            React.createElement(Flex.Item, { style: styles.itemTitle }, title.type && title.type == navType.drop ?
                React.createElement(View, null,
                    React.createElement(Picker, { title: "", okText: "\u786E\u5B9A", dismissText: "\u53D6\u6D88", data: title.data, cols: 1, value: [title.value], onChange: (v) => {
                            handleClick('title', v);
                        }, onOk: (v) => {
                            handleClick('title', v);
                        } },
                        React.createElement(CustomChildren, null))) :
                title.type == navType.text ?
                    React.createElement(Text, { style: [styles.text, styles.title] }, title.text) :
                    React.createElement(View, null, title.element)),
            React.createElement(Flex.Item, { style: styles.rightItem, onPress: () => {
                    handleClick('right');
                } }, rightContent.type && rightContent.type == navType.icon ?
                React.createElement(Icons, { iconName: rightContent.iconName, width: "20", height: "15" }) :
                rightContent.type == navType.text ?
                    React.createElement(Text, { style: styles.text }, rightContent.text) :
                    rightContent.type == navType.element ?
                        React.createElement(View, null, rightContent.element) : null))));
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
});
//# sourceMappingURL=NavBar.js.map