import React, {Component} from 'react';
import adapt from '../interfaces/adapt'
import {View, StyleSheet, Text} from 'react-native';
import {Flex,Modal} from 'antd-mobile-rn';

export default class Notice extends Component<any, any> {

    public closeTimer;
    constructor(props: any) {
        super(props);
    }

    componentWillUnmount() {
        this.clearCloseTimer();  // 当有意外关闭的时候 清掉定时器
    }

    componentWillReceiveProps(nextProps) {
        this.clearCloseTimer();
        this.closeTimer = setTimeout(() => {
            this.close();
        }, 8000)
    }

    close() {
        this.clearCloseTimer();
        const {authDispaly} = this.props;
        authDispaly();
    }

    clearCloseTimer() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }

    render() {
        return (
        <Modal
            maskClosable={true}
            animationType="fade"
            transparent={false}
            popup={true}
            onClose={()=>this.close()}
            visible={this.props.display}
        >
            <View style={styles.toast}>
                <View style={styles.toastView}>
                    <Text style={styles.toastText}>{this.props.content}</Text>
                </View>
            </View>
        </Modal>
        );
    }
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        backgroundColor: '#F7C400',
        left: 0,
        top: 0,
        width: '100%',
        paddingTop:adapt.isIphonex() ? adapt.pxToDp(40) : adapt.pxToDp(20)
    },
    toastView: {
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: adapt.pxToDp(10),
        paddingRight: adapt.pxToDp(10)
    },
    toastText: {
        margin: adapt.pxToDp(8),
        color: '#6D4C02',
        lineHeight:adapt.pxToDp(15),
        paddingLeft: adapt.pxToDp(5),
        fontSize: adapt.setSpText(12)
    },

});