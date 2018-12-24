import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { List, Flex, ActivityIndicator } from 'antd-mobile-rn';
import { compare } from "../interfaces/utils";
import adapt from "../interfaces/adapt";
import loadingStyle from 'antd-mobile-rn/lib/activity-indicator/style/index.native';
import I18n from "../interfaces/i18n";
const Item = List.Item;
const Brief = Item.Brief;
export const Group = (props) => {
    const { group, loading, changeTab } = props;
    return (React.createElement(View, { style: styles.contain },
        React.createElement(Flex, { justify: "center", align: "center", style: { width: '100%' } },
            React.createElement(ActivityIndicator, { text: I18n.t('loading'), animating: loading, styles: _loadingStyle })),
        React.createElement(List, { style: { width: '100%' } },
            group.length == 0 && !loading ?
                React.createElement(Item, null,
                    React.createElement(Brief, { style: { fontSize: adapt.setSpText(14), textAlign: 'center' } }, I18n.t('unable_get_group_info'))) : null,
            group.sort(compare("gid")).map((item, index) => {
                return (index < 5 ?
                    React.createElement(Item, { arrow: "horizontal", key: item.gid, onClick: () => changeTab(item.gid) },
                        React.createElement(Brief, { style: {
                                fontSize: adapt.setSpText(14),
                                color: "#6D6D72"
                            } }, item.name == 'DEFAULT' ? I18n.t('default') : item.name),
                        React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: {
                                paddingTop: adapt.pxToDp(9),
                                paddingBottom: adapt.pxToDp(4)
                            } },
                            React.createElement(Flex, { direction: "row", justify: "start", align: "center", style: { width: adapt.pxToDp(135) } },
                                React.createElement(Text, { style: styles.text }, item.shares_15m),
                                React.createElement(Brief, { style: styles.unit },
                                    item.shares_unit,
                                    "H/s")),
                            React.createElement(Flex, { direction: "row", justify: "start", align: "center" },
                                React.createElement(Text, { style: styles.text },
                                    item.workers_active,
                                    "/",
                                    item.workers_total),
                                React.createElement(Brief, { style: styles.unit }, "Miners")))) : null);
            }))));
};
const styles = StyleSheet.create({
    contain: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'relative',
        top: 0,
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
});
const _loadingStyle = Object.assign({}, loadingStyle, { spinner: Object.assign({}, loadingStyle.spinner, { height: adapt.pxToDp(50), backgroundColor: '#ffffff' }) });
//# sourceMappingURL=Group.js.map