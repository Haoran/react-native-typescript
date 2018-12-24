import React, { Component } from 'react';
import { StyleSheet, View, WebView, } from 'react-native';
import adapt from "../interfaces/adapt";
export default class Login extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { params } = this.props.navigation.state;
        return (React.createElement(View, { style: styles.container },
            React.createElement(WebView, { scalesPageToFit: true, source: { uri: params.url }, style: { width: adapt.screenW(), height: adapt.screenH() }, startInLoadingState: true, originWhitelist: ['*'] })));
    }
}
Login.navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.name,
    headerStyle: {
        backgroundColor: '#0288d1',
        height: adapt.pxToDp(44),
        borderBottomWidth: 0,
    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
//# sourceMappingURL=WebviewPage.js.map