const koa_router =require("koa-router");
const router = koa_router();
const smsSdk =require("../modules/smsSdk");

const TopClient = smsSdk.TopClient;
const client = new TopClient({
    'appkey':'24233581',
    'appsecret':'6376401370d21d442e29acf4b029273a',
    'REST_URL':'http://gw.api.taobao.com/router/rest'});

router.get('/', function (ctx, next) {
    ctx.body = 'this a users response!';
});
router.get('/login',async (ctx,next)=>{
    await ctx.render('login', {"error":"输入账号"});
});
router.post('/login',async (ctx,next)=>{
    let params = ctx.request.body;
    if (params.userName=="admin456"){
        ctx.session.id="admin123";
        ctx.redirect('/');
    }else{
        //ctx.redirect('/users/login');
        await ctx.render('login', {"error":"账号错误！"});
    }

});
// 发送短信
router.post('/send', async function (ctx, next) {
    let params = ctx.request.body;
    const sms_param = {
        time: new Date().Format("yyyy年M月d日"),
        num: params.price+"",
    };
    try {
        const result = await send({
            'extend': '123456',
            'sms_type': 'normal',
            'sms_free_sign_name': '快捷充值',
            'sms_param': JSON.stringify(sms_param),
            'rec_num': params.tels,
            'sms_template_code': 'SMS_70630225'
        });
        if ("error_response" in result){
            params.suc = false;
            params.error = result.error_response.sub_msg;
        }else{
            params.suc = true;
        }

    }catch (error){
        params.suc =false;
        if (error.sub_code){
            params.error = error.sub_code;
        }
        console.log(error)
    }finally {
        params.time = sms_param.time;
        ctx.body = {code:0,msg:"suc",params:params};
    }

});

function send(params) {
    return new Promise((resolve, reject) => {
        client.execute('alibaba.aliqin.fc.sms.num.send', params,function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
module.exports = router;
