import moment from 'moment';
import Locale_CN from 'moment/locale/zh-cn';
import Locale_EN from 'moment/locale/es-us';



export function momentLocal(local){
    switch(local){
        case 'zh-cn' :
            moment.updateLocale('zh-cn', Locale_CN);
            break;
        default:
            moment.updateLocale('en', Locale_EN);
            break;
    }
}