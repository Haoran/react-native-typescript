import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {ActivityIndicator} from 'antd-mobile-rn';
import {observer} from "mobx-react";
import {observable} from "mobx";
import adapt from "../interfaces/adapt";

@observer
export default class Welcome extends Component<any, any> {

    @observable loading: boolean;
    @observable timer: any;

    constructor(props: any) {
        super(props);
        this.loading = true;
    }

    componentWillMount() {
        this.timer = setTimeout(() => {
            this.loading = false
            clearTimeout(this.timer);
        }, 2000)
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Route/>*/}
                {/*<ActivityIndicator text="loading..." toast animating={this.loading}/>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },
})