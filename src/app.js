import Koa from "koa";
import koa_router from "koa-router";
import views from "koa-views";
import convert from "koa-convert";
import koaBodyParser from "koa-bodyparser";
import json from "koa-json"
import logger from "koa-logger";
import index from "./routes/index";
import users from "./routes/users";
import koa_static from "koa-static";
import koaCors from "koa-cors";
const app = new Koa();
const router = koa_router();



const bodyParser = koaBodyParser();



// middlewares
app.use(convert(bodyParser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(koa_static(__dirname + '/public'));
app.use(convert(koaCors()));
app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});


router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});



Date.prototype.Format = function(fmt)
{ //author: meizz
    const o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
module.exports = app;