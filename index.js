import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import App from './src/App';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader','Class RCTCxxModule']);

AppRegistry.registerComponent('BTCProject', () => App);



