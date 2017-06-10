import koa_router from "koa-router";
const router = koa_router();
import smsSdk from "../modules/smsSdk";

const TopClient = smsSdk.TopClient;
const client = new TopClient({
    'appkey':'23492839',
    'appsecret':'e90847ae379fd8b5af09fb928a24f28e',
    'REST_URL':'http://gw.api.taobao.com/router/rest'});

router.get('/', function (ctx, next) {
    ctx.body = 'this a users response!';

    console.log(new Date().Format("yyyy年M月d日"))
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
            'sms_template_code': 'SMS_22410152'
        });
        console.log(result)
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
