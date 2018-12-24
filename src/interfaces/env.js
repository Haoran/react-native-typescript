//正式环境 official_config
//测试环境 develop_config
var official_config;
(function (official_config) {
    official_config["version"] = "1.5.0";
    official_config["apiVersion"] = "v1";
    official_config["multiCoinStats"] = "https://cn-pool.api.btc.com/v1/pool/multi-coin-stats?dimension=1h&no_share_history=1&is_decimal=1";
    official_config["allUrlConfig"] = "https://cn-pool.api.btc.com/public/v1/all-url-config";
    official_config["poolAppLogin"] = "https://pool.btc.com/app/v1/login";
    official_config["poolAppRegister"] = "https://pool.btc.com/app/v1/register";
    official_config["tokenUrl"] = "https://pool.btc.com/app/v1/login/token";
})(official_config || (official_config = {}));
var develop_config;
(function (develop_config) {
    develop_config["version"] = "1.5.0";
    develop_config["apiVersion"] = "v1";
    develop_config["multiCoinStats"] = "https://devpool.api.btc.com/v1/pool/multi-coin-stats?dimension=1h&no_share_history=1&is_decimal=1";
    develop_config["allUrlConfig"] = "https://devpool.api.btc.com/public/v1/all-url-config";
    develop_config["poolAppLogin"] = "https://devpool.btc.com/app/v1/login";
    develop_config["poolAppRegister"] = "https://devpool.btc.com/app/v1/register";
    develop_config["tokenUrl"] = "https://devpool.btc.com/app/v1/login/token";
})(develop_config || (develop_config = {}));
export default official_config;
//# sourceMappingURL=env.js.map