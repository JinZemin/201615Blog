/**
 * Created by jinzemin on 2017/4/8.
 */
let express=require("express");
let path=require('path');
let user=require('./routes/user');
let index=require('./routes/index');
let article=require('./routes/article');
let session=require('express-session');
let bodyParser=require('body-parser');
// 这是一个把信息写在session中的中间件 依赖于session 他会在req上增加flash属性
let flash=require('connect-flash');
let MongoStore=require('connect-mongo')(session);//把session存储到mongo数据库中
//app是一个请求监听函数
let app=express();
//此中间件会判断请求体类型，如果是json自己就会默认处理，如果不是json，会走next app.use(bodyParser.urlencoded({extended : true}))  默认是处理json   app.use(bodyParser.json()) 可以不写
//app.use(bodyParser.json());//解析json对象
app.use(bodyParser.urlencoded({extended : true}));//解析字符串
app.use(session({
    secret : 'zfpx',//加密session
    resave : true,//每次请求都要重新保存session
    saveUninitialized : true,//保存未初始化的session
    store:new MongoStore({//指定session会话的存储位置 此参数需要加载模块connect-mongo
        url:require('./config').url
    })
}));
app.use(flash());
//目标是把success err 从req,flash取出来
//
app.use(function(req, res, next){
    //把req.session 中的user取出来赋给模板变量数据对象
    res.locals.user = req.session.user;
    res.locals.success=req.flash("success").toString();
    res.locals.error=req.flash("error").toString();
    res.locals.keyword='';
    next();
});
//引入模板
//设置模板引擎
app.set("view engine", 'html');
//设置模板根目录
app.set("views", path.resolve(__dirname,"views"));
//设置模版的渲染方法
app.engine("html", require("ejs").__express);
//指定public为静态文件根目录
app.use(express.static(path.resolve("public")));
app.use('/user',user);
app.use('/article',article);
app.use('/',index);
app.listen(8080);
