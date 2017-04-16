/**
 * Created by jinzemin on 2017/4/8.
 */
let express=require('express');
let Article=require('../model').Article;
//运行Router方法之后会返回一个路由中间件的实例
let router=express.Router();
//需要把user属性从字符串转换成对象 populate('user')
router.get('/',function(req,res){
    //真正渲染模板的是req.locals.success='hello',渲染之前会把第二个参数对象属性赋给res.locals
    //要查询标题中包含关键字
    let pageNum=isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);
    let pageSize=isNaN(req.query.pageSize)?5:parseInt(req.query.pageSize);
    let query={};
    if(req.query.keyword){
        query.title=new RegExp(req.query.keyword);
    }
    Article.count(query,function(err,count){
        Article.find(query).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
            res.render('index',{
                title:'主页',
                articles,
                keyword:req.query.keyword,
                pageNum,//当前页码
                pageSize,//每页条数
                totalPages:Math.ceil(count/pageSize)//总页数
            })
        })
    })
});
module.exports=router;