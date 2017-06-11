/**
 * Created by wenshao on 2017/6/10.
 * 选择不同的环境执行不同的配置
 */
const develop = require('./develop');
const production = require('./production');
const path = require("path");

const envList = ["develop","production"];
const NODE_ENV = process.env.NODE_ENV;
const data ={
    develop: develop,
    production: production
}[NODE_ENV || 'develop'];

if (!NODE_ENV && envList.indexOf(NODE_ENV) && data){
    throw ("process.env.NODE_ENV 为空或者错误");
}

const envInfo = {
    env: data.env || "develop",
    port: data.port || 8080
};
let logDir;

if (data.logDir && typeof data.logDir=="string" && data.logDir[0] =='/'){
    logDir = data.logDir;
}else {
    logDir = path.resolve(__dirname, '../logs');
}

const getEnvInfo = function () {
    return envInfo
};
const getLogDir = function () {
    return logDir;

};


exports.getEnvInfo = getEnvInfo;
exports.getLogDir = getLogDir;

