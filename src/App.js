import * as React from 'react';
import { Provider } from 'mobx-react';
import stores from './stores';
import Route from './route';
export default class App extends React.Component {
    render() {
        return (React.createElement(Provider, { store: stores },
            React.createElement(Route, null)));
    }
}
//# sourceMappingURL=App.js.map