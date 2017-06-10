import koa_router from "koa-router";
const router = koa_router();


router.get('/', async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    };
    await ctx.render('index', {});
});



module.exports = router;
