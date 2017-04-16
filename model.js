/**
 * Created by jinzemin on 2017/4/8.
 * 数据库连接
 */
let mongoose = require("mongoose");
mongoose.Promise=Promise;
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(require('./config').url);
let UserSchema = new mongoose.Schema({
    username : {type : String, isRequired : true},
    password : {type : String, isRequired : true},
    email : String,
    avatar:String
},{collection:"user"});
//手工强行指定集合的名称 {collection:"user"}
exports.User =mongoose.model('User',UserSchema);
//与上写法相等
// let UserModel =mongoose.model('User',UserSchema);
// exports.User=UserModel;
let ArticleSchema=new mongoose.Schema({
    title : String,//文章标题
    content : String,//文章内容
    createAt : {type : Date, default : Date.now},//发表文章的日期。默认为当前日期
    user : {type : ObjectId, ref : 'User'}//类型是对象ID类型，ref 外键 引用的是User集合中的主键ID
});
exports.Article=mongoose.model('Article',ArticleSchema);