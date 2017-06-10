const koa_router =require("koa-router");
const router = koa_router();


router.get('/', async function (ctx, next) {
    ctx.state = {
        title: 'koa2 title'
    };
    await ctx.render('index', {});
});



module.exports = router;
