import * as React from 'react';
import {Provider} from 'mobx-react';
import stores from './stores';
import Route from './route';

export default class App extends React.Component<any, any> {
    render() {
        return (
            <Provider store={stores}>
                <Route/>
            </Provider>
        )
    }
}