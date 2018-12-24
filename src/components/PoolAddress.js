import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import adapt from "../interfaces/adapt";
import I18n from "../interfaces/i18n";
export const PoolAddress = (props) => {
    const { name, stratum_url, handleLink } = props;
    return (React.createElement(View, { style: styles.poolAddress },
        React.createElement(View, { style: styles.caption },
            React.createElement(Text, { style: styles.caption_text }, I18n.t('mine_address')),
            React.createElement(Text, { style: styles.caption_more, onPress: () => handleLink() }, I18n.t('more'))),
        stratum_url.config.map(item => {
            return (React.createElement(View, { style: styles.item, key: item },
                React.createElement(Text, { style: styles.text }, item)));
        }),
        React.createElement(View, { style: styles.item },
            React.createElement(Text, { style: styles.text },
                I18n.t('worker_name_tips'),
                ": \"",
                name,
                ".001\"\u3001\"",
                name,
                ".002\" ",
                I18n.t('etc')))));
};
const styles = StyleSheet.create({
    poolAddress: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'relative',
        top: 0,
    },
    caption: {
        width: '100%',
        height: 42,
        backgroundColor: '#f6f6f6',
        marginBottom: '5%',
        justifyContent: 'center',
    },
    caption_text: {
        color: '#999999',
        position: 'absolute',
        textAlign: 'left',
        fontWeight: 'bold',
        paddingLeft: adapt.pxToDp(15),
        fontSize: adapt.setSpText(15)
    },
    caption_more: {
        color: '#2194ed',
        right: 0,
        height: '100%',
        padding: adapt.pxToDp(15),
        textAlign: 'right',
        fontSize: adapt.setSpText(15)
    },
    item: {
        width: '100%',
        height: 38,
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    text: {
        fontSize: adapt.setSpText(14),
        position: 'absolute',
        textAlign: 'left',
        paddingLeft: adapt.pxToDp(15),
        color: '#999999',
    },
});
//# sourceMappingURL=PoolAddress.js.map