let express = require ('express');
//引入数据库连接模块
let db = require('.db');
//引入城市模型
let cityModel = require('./model/cityModel');
let app = express();
//等待数据库连接成功
db.then(()=>{
    app.get('/getAllProvinces',(request,response)=>{
        cityModel.find({level:1},{name:1,province:1,_id:0},(err,data)=>{})
}).catch((err)=>{
    console.log(err);
})

});
app.listen(3000,(err)=>{
    if (!err) console.log('三级联动服务器启动成功');
    else console.log(err);
})