//正式环境 official_config
//测试环境 develop_config

enum official_config  {
    version='1.5.0',
    apiVersion='v1',
    multiCoinStats= 'https://cn-pool.api.btc.com/v1/pool/multi-coin-stats?dimension=1h&no_share_history=1&is_decimal=1',
    allUrlConfig='https://cn-pool.api.btc.com/public/v1/all-url-config',
    poolAppLogin='https://pool.btc.com/app/v1/login',
    poolAppRegister='https://pool.btc.com/app/v1/register',
    tokenUrl='https://pool.btc.com/app/v1/login/token',
}

enum develop_config  {
    version='1.5.0',
    apiVersion='v1',
    multiCoinStats= 'https://devpool.api.btc.com/v1/pool/multi-coin-stats?dimension=1h&no_share_history=1&is_decimal=1',
    allUrlConfig='https://devpool.api.btc.com/public/v1/all-url-config',
    poolAppLogin='https://devpool.btc.com/app/v1/login',
    poolAppRegister='https://devpool.btc.com/app/v1/register',
    tokenUrl='https://devpool.btc.com/app/v1/login/token',
}


export default official_config;