import React from 'react';
import {Image, View, StyleSheet} from 'react-native';

import adapt from '../interfaces/adapt'

/**
 * iconName:图片名称
 * uri:图片http地址
 * */
const iconUrl = {
    button_header_menu: require('../assets/img/icon/button_header_menu.png'),
    icon_header_add:require('../assets/img/icon/icon_header_add.png'),
    loadingRow:require('../assets/img/icon/loading-row.gif'),
    hide_sub_account:require('../assets/img/icon/hide_sub_account.png'),
    img_main_select:require('../assets/img/icon/img_main_select.png'),
    arrow_right:require('../assets/img/icon/arrow_right.png'),
    copy:require('../assets/img/icon/icon_main_copy.png'),
    icon_header_Detail:require('../assets/img/icon/icon_header_Detail.png'),
    check:require('../assets/img/icon/button_miners_main_unselect.png'),
    checked:require('../assets/img/icon/button_miners_main_select.png'),
    loading:require('../assets/img/icon_loading.png')
}

export const Icons = (props: any) => {

    const {iconName, width, height, uri} = props;

    return (
        <View  style={{
            width: adapt.pxToDp(width ? width : 30),
            height: adapt.pxToDp(height ? height : 30),
        }}>
            {
                iconUrl[iconName] ?
                    <Image
                        source={iconUrl[iconName]}
                        style={{
                            width: adapt.pxToDp(width ? width : 30),
                            height: adapt.pxToDp(height ? height : 30),
                        }}
                    />
                    :
                    uri ?
                        <Image
                            source={{uri: uri}}
                            style={{
                                width: adapt.pxToDp(width ? width : 30),
                                height: adapt.pxToDp(height ? height : 30),
                            }}
                        />
                        :
                        <Image
                            source={iconUrl["loading"]}
                            style={{
                                width: adapt.pxToDp(width ? width : 30),
                                height: adapt.pxToDp(height ? height : 30),
                            }}
                        />

            }
        </View>
    )
}

