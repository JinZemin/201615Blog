/**
 * Created by jinzemin on 2017/4/8.
 */
let express = require('express');
let ware = require("../ware");
let Article = require('../model').Article;
//运行Router方法之后会返回一个路由中间件的实例
let router = express.Router();
router.get('/add', ware.checkLogin, function(req, res){
    res.render('article/add', {title : '发表文章', article : {}});
});
router.post('/add', ware.checkLogin, function(req, res){
    let article = req.body;
    //从当前回话中得到用户的ID，然后赋给文章的user属性
    article.user = req.session.user._id;
    Article.create(article, function(err, doc){
        if(err){
            req.flash("error", '发表文章失败！');
            res.redirect('back');
        } else {
            req.flash('success', '发表成功');
            res.redirect('/');
        }
    })
});
router.get('/detail/:_id', function(req, res){
    let _id = req.params._id;
    Article.findById(_id, function(err, article){
        if(err){
            res.redirect('back')
        } else {
            res.render('article/detail', {title : '文章详情', article})
        }
    })
});
router.get('/delete/:_id', function(req, res){
    let _id = req.params._id;
    //删除,更新update 传的的参数 是一个对象
    Article.remove({_id}, function(err, doc){
        if(err){
            req.flash("error", "删除文章失败");
            res.redirect('back');
        } else {
            req.flash("success", "删除文章成功!");
            res.redirect('/');
        }
    })
});
router.get('/update/:_id', function(req, res){
    //获取文章的标识ID
    let _id = req.params._id;
    //数据库中根据ID查找对应的数据
    Article.findById(_id, function(err, article){
        if(err){
            res.redirect("back");
        } else {
            res.render("article/add", {article, title : "修改文章"});
        }
    })
});
router.post('/update/:_id', function(req, res){
    //获取url文章的标识ID
    let _id = req.params._id;
    let body = req.body;
    //数据库中根据ID查找对应的数据
    Article.update({_id}, body, function(err, result){
        if(err){
            req.flash("error","更新文章失败");
            res.redirect("back");
        } else {
            req.flash("success","更新文章成功");
            res.redirect(`/article/detail/${_id}`);
        }
    });
});
module.exports = router;