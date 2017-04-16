/**
 * Created by jinzemin on 2017/4/8.
 */
let express=require('express');
//运行Router方法之后会返回一个路由中间件的实例
let router=express.Router();
let User=require('../model').User;
let multer=require('multer');
let ware=require("../ware");
//因为系统是在sever.js上启动的 所有当前路径的目录
let upload=multer({dest:'./public/uploads'});
router.get('/signup',ware.checkNotLogin,function(req,res){
    res.render('user/signup',{title:'注册'});
});
router.get('/signin',ware.checkNotLogin,function(req,res){
    res.render('user/signin',{title:'登录'});
});
router.post('/signup',ware.checkNotLogin,upload.single('avatar'),function(req,res){
    let user=req.body;
    console.log(req.file);
    user.avatar=`/uploads/${req.file.filename}`;
    User.findOne({username:user.username},function(err,oldUser){
        if(oldUser){
            req.flash("error",'此用户已经被注册');
            req.redirect('back');
        }else {
            User.create(user,function(err,doc){
                if(err){
                    req.flash('error',err.toString());
                    res.redirect('back')
                }else {
                    req.flash('success','注册成功请登录');
                    res.redirect('/user/signin');
                }
            });
        }
    })
});
router.post('/signin',ware.checkNotLogin,function(req,res){
    let user=req.body;
    User.findOne(user,function(err,doc){
        if(err){
            req.flash('error',err.toString());
            res.redirect('back')
        }else {
            if(doc){
                req.flash('success','登录成功');
                req.session.user=doc;
                console.log(req.session.user);
                res.redirect('/');
            }else {
                req.flash('error','登录失败，请重新登录');
                res.redirect('back');
            }
        }
    })
});
router.get('/signout',ware.checkLogin,function(req,res){
    req.session.user=null;
    res.redirect('/user/signup');
});
module.exports=router;