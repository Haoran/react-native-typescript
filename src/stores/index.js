import Appstore from './appStore';
import Dashboard from './dashboard';
import Miner from './miner';
import Auth from './auth';
import Welcome from './welcome';
import Create from './createAccount';
import ModifyAccount from './modifyAccount';
export default {
    welcome: new Welcome(),
    auth: new Auth(),
    appStore: new Appstore(),
    create: new Create(),
    dashboard: new Dashboard(),
    modifyAccount: new ModifyAccount(),
    miner: new Miner(),
};
//# sourceMappingURL=index.js.map