import { PixelRatio, Dimensions, Platform } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const fontScale = PixelRatio.getFontScale();
//像素密度
const DEFAULT_DENSITY = 2;
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
const defaultWidth = 375;
const defaultHeight = 667;
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
//缩放比例
const _scaleWidth = screenW / defaultWidth;
const _scaleHeight = screenH / defaultHeight;
export default {
    isIphonex() {
        return (Platform.OS === 'ios' &&
            ((screenH === X_HEIGHT && screenW === X_WIDTH) ||
                (screenH === X_WIDTH && screenW === X_HEIGHT)));
    },
    screenW: function () {
        return screenW;
    },
    screenH: function () {
        return screenH;
    },
    /**
     * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
     * 横向的尺寸直接使用此方法
     * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
     * @param size 设计图的尺寸
     * @returns {number}
     */
    pxToDp: function (size) {
        return size * _scaleWidth;
    },
    /**
     * 屏幕适配 , 纵向的尺寸使用此方法应该会更趋近于设计稿
     * 如：height ,paddingVertical ,paddingTop ,paddingBottom ,marginVertical ,marginTop ,marginBottom
     * @param size 设计图的尺寸
     * @returns {number}
     */
    height: function (size) {
        return size * _scaleHeight;
    },
    /**
     * 设置字体的size（单位px）
     * @param size 传入设计稿上的px
     * @returns {Number} 返回实际sp ,会随系统缩放比例改变，如不需要请去掉 * fontScale
     */
    setSpText: function (size) {
        const scale = Math.min(_scaleWidth, _scaleHeight);
        return size * scale * fontScale;
    },
};
//# sourceMappingURL=adapt.js.map