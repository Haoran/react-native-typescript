var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import { observer } from "mobx-react";
import { observable } from "mobx";
let Welcome = class Welcome extends Component {
    constructor(props) {
        super(props);
        this.loading = true;
    }
    componentWillMount() {
        this.timer = setTimeout(() => {
            this.loading = false;
            clearTimeout(this.timer);
        }, 2000);
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    render() {
        return (React.createElement(View, { style: styles.container }));
    }
};
__decorate([
    observable
], Welcome.prototype, "loading", void 0);
__decorate([
    observable
], Welcome.prototype, "timer", void 0);
Welcome = __decorate([
    observer
], Welcome);
export default Welcome;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
    },
});
//# sourceMappingURL=InitPage.js.map