# react_native_app
ReactNative build Android BTC.com Pool Application

> 运行android版本 `react-native run-android`
> 运行ios版本 `react-native run-ios`
> 调试打包 `npm run bundle-ios  `


## step
* yarn install
* npm run ios &&  npm run android
* react-native link react-native-vector-icons
* react-native link react-native-device-info
* react-native link react-native-svg
* react-native link react-native-shake-event
* react-native link react-native-cookies
  
## ios 打包

## third-party error

* rm -rf node_modules/ && yarn cache clean && yarn install
* cd node_modules/react-native/scripts
* ./ios-install-third-party.sh
* cd node_modules/react-native/third-party/glog-0.3.4
* ./configure



### 常用的RN组件

- [ ] js.coach ReactNative 组件搜索 https://js.coach/ 


## DEMO Dashload界面

![20180426152474312140554.jpg](http://oymnmndhh.bkt.clouddn.com/20180426152474312140554.jpg)

![20180426152474312464816.jpg](http://oymnmndhh.bkt.clouddn.com/20180426152474312464816.jpg)


## 提示

### native-echarts 组件 源码修改 

```
// http://www.cnblogs.com/GaiaBing/p/8392063.html
 
虚拟机上演示出现了滚动条，并且拖动时就会出现空白,双击会缩小像这样

参考GitHub上给出的方法修改成功：
node_modules\native-echarts\src\components\Echarts\index.js文件，修改WebView的scalesPageToFit={true}

虚拟机上演示出现了滚动条，并且拖动时就会出现空白,双击会缩小像这样

ios release运行不显示图表，一片空白
node_modules\native-echarts\src\components\Echarts\index.js文件, WebView加上originWhitelist={['*']}

如有其他echarts 图标问题 
请阅读 https://segmentfault.com/a/1190000015758777

```