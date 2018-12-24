import I18n from 'react-native-i18n';
import DeviceInfo from 'react-native-device-info';
import { momentLocal } from "../assets/lib/moment";
import { language } from "./lang";
import api from "../stores/api";
import en from '../assets/language/en';
import zh from '../assets/language/zh';
//默认为英文
I18n.defaultLocale = DeviceInfo.getDeviceLocale();
I18n.fallbacks = true;
I18n.locale = DeviceInfo.getDeviceLocale();
// console.log(I18n)
I18n.translations = {
    en,
    zh,
};
I18n.getLanguage = () => {
    const local = I18n.locale.split("zh").length > 1 ? language.zh : language.en;
    return local;
};
I18n.setLanguage = (lang) => {
    console.log('update: ' + lang);
    if (lang == language.auto) {
        I18n.locale = DeviceInfo.getDeviceLocale();
    }
    else {
        I18n.locale = lang;
    }
    momentLocalLanuage(I18n);
};
momentLocalLanuage(I18n);
function momentLocalLanuage(_I18n) {
    const local = _I18n.locale.split("zh").length > 1 ? language.zh : language.en;
    api.updateHttpConfigLang(local);
    momentLocal(local);
}
export default I18n;
//# sourceMappingURL=i18n.js.map