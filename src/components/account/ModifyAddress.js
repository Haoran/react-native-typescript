var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Clipboard } from 'react-native';
import adapt from '../../interfaces/adapt';
import { Icons } from '../../components/Icons';
import { List, WingBlank, WhiteSpace, Toast } from 'antd-mobile-rn';
const Item = List.Item;
export default class Modify extends Component {
    constructor(props) {
        super(props);
        this._setClipboardContent = (v) => __awaiter(this, void 0, void 0, function* () {
            Clipboard.setString(v);
            Toast.info('已复制到剪贴板!', 1);
        });
    }
    render() {
        const { address, name } = this.props.navigation.state.params;
        return (React.createElement(View, { style: styles.container },
            React.createElement(List, { renderHeader: () => name },
                React.createElement(Item, { extra: React.createElement(TouchableOpacity, { onPress: () => this._setClipboardContent(address) },
                        React.createElement(Icons, { iconName: "copy", width: "20", height: "20" })) },
                    React.createElement(Text, { style: { paddingRight: adapt.pxToDp(5), color: '#C7C7CD', fontSize: adapt.setSpText(16) } }, address))),
            React.createElement(WhiteSpace, null),
            React.createElement(WingBlank, null,
                React.createElement(Text, { style: { color: '#FF3B30', fontSize: adapt.setSpText(13) } }, "If you need to modify this address,please login on pool website,click \u201DSettings\u201D at the top right corner."))));
    }
}
Modify.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name,
    headerStyle: {
        backgroundColor: '#22a7f0',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFF4',
        width: '100%',
    },
});
//# sourceMappingURL=ModifyAddress.js.map