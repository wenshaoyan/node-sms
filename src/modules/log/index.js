/**
 * Created by wenshao on 2017/6/11.
 * 控制台输出
 */

const NODE_ENV = process.env.NODE_ENV || "develop";

Date.prototype.Format = function (fmt) { //author: meizz
    const o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


class logJson {
    static i(url, params) {
        if (NODE_ENV == "develop") {
            let data = new Date().Format("yyyy-MM-dd-hh:mm:ss:S");
            console.log(data, url, params)
        }
    }

    static e(url, params) {
        let data = new Date().Format("yyyy-MM-dd-hh:mm:ss:S");
        console.log(data, url, params)
    }

    static d(url, params) {
        if (NODE_ENV == "develop") {
            let data = new Date().Format("yyyy-MM-dd-hh:mm:ss:S");
            console.log(data, url, params)
        }

    }
}
module.exports = logJson;