import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    WebView,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation'
import adapt from "../interfaces/adapt";

export default class Login extends Component<any, any> {

    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.name,
        headerStyle: {
            backgroundColor: '#0288d1',
            height: adapt.pxToDp(44),
            borderBottomWidth: 0,
        },
    });

    constructor(props: any) {
        super(props);
    }

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <WebView
                    scalesPageToFit={true}
                    source={{uri: params.url}}
                    style={{width: adapt.screenW(), height: adapt.screenH()}}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                >
                </WebView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
