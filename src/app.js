const Koa=require("koa");
const koa_router=require("koa-router");
const views=require("koa-views");
const convert=require("koa-convert");
const koaBodyParser=require("koa-bodyparser");
const json=require("koa-json");
const index=require("./routes/index");
const users=require("./routes/users");
const koa_static=require("koa-static");
const koaCors=require("koa-cors");
const app = new Koa();
const router = koa_router();
const logUtil = require('./utils/logUtil');
const prototypeUtil = require('./utils/prototypeUtil');
const session = require('koa-session');
const Log = require('./modules/log');
prototypeUtil.init();



const bodyParser = koaBodyParser();

app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
};


// middlewares
app.use(convert(bodyParser));
app.use(convert(json()));
// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    let ms;
    try {
        //开始进入到下一个中间件
        await next();

        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);

    } catch (error) {

        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});
app.use(koa_static(__dirname + '/public'));
app.use(convert(koaCors()));
app.use(views(__dirname + '/views', {
  extension: 'jade'
}));


app.use(session(CONFIG, app));



app.use(async (ctx,next) => {
    const urls = new Set(["/users/login","/favicon.ico"]);
    // ignore favicon
    if (urls.has(ctx.path)){
        await next();
        return;
    }
    if (ctx.session.id=="admin456"){
        await next();
    }else{
        //await next();
         ctx.redirect('/users/login');
    }
});



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
  logger.error('server error', err, ctx);
});



module.exports = app;