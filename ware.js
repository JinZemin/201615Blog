/**
 * Created by jinzemin on 2017/4/9.
 * 编写一个中间件函数 当客户端未登陆时跳到登录页，如果已经登陆可以继续访问
 */
exports.checkLogin = function(req, res, next){
    if(req.session.user){
        next();
    } else {
        req.flash("error", "您未登陆，请您登录！");
        res.redirect('/user/signin');
    }
};
/**
 * 编写一个中间件函数 要求未登录才能继续，否则不让访问
 * @param req
 * @param res
 * @param next
 */
exports.checkNotLogin = function(req, res, next){
    if(req.session.user){
        req.flash('error', "您已经登陆，请不要重复登陆");
        res.redirect('/');
    } else {
        next();
    }
};