import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Flex, List } from 'antd-mobile-rn';
import adapt from "../../interfaces/adapt";
import { compare } from "../../interfaces/utils";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const Item = List.Item;
const Brief = Item.Brief;
export const GroupListDrop = (props) => {
    const { list, handleGroup, handleCreate } = props;
    return (React.createElement(View, { style: styles.contentContainer, onStartShouldSetResponder: () => handleGroup("hidden") },
        React.createElement(View, { style: styles.blackBoard },
            React.createElement(View, { style: styles.view },
                React.createElement(ScrollView, { showsVerticalScrollIndicator: false },
                    React.createElement(List, null, list.sort(compare("gid")).map(item => {
                        return (React.createElement(Item, { key: item.gid, onClick: () => handleGroup(item.gid) },
                            React.createElement(Flex, { direction: "row", justify: "center", align: "center" },
                                React.createElement(Text, { style: styles.text1 }, item.name == 'DEFAULT' ? '未分组' : item.name),
                                React.createElement(Text, { style: styles.text2 },
                                    item.shares_15m,
                                    " ",
                                    item.shares_unit,
                                    "H/s"),
                                React.createElement(Text, { style: styles.text3 },
                                    item.workers_active,
                                    "/",
                                    item.workers_total))));
                    }))),
                React.createElement(Item, { style: { borderWidth: 0.4, borderColor: 'rgba(0,0,0,0.2)', } },
                    React.createElement(Flex, { direction: "row", justify: "start", align: "center", onPress: () => handleCreate() },
                        React.createElement(FontAwesomeIcon, { name: "plus-circle", size: 18, color: "#22A7F0", style: styles.iconDrop }),
                        React.createElement(Text, { style: styles.text4 }, "Create a new group")))))));
};
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
        maxHeight: adapt.pxToDp(280),
        backgroundColor: "#ffffff",
        zIndex: 99,
    },
    text1: {
        width: '45%',
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
        width: '20%',
        color: '#666666',
        textAlign: 'right',
        fontSize: adapt.setSpText(14),
        fontFamily: "Helvetica Neue",
    },
    text4: {
        fontSize: adapt.setSpText(14),
        color: '#22A7F0'
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
//# sourceMappingURL=GroupListDrop.js.map