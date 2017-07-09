/**
 * Created by tiedan on 2017/6/23.
 */
const express = require("express");
const static = require("express-static");
const mysql = require("mysql");
const server=express();
server.listen(4000);
let db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'vue_database'
});
let page_size=5; //一页有几条留言
//添加留言
server.get('/add',(req,res)=>{
    let name = req.query.name;
    let age = req.query.age;
    if(name&&age){
        let sql=`insert into users values (0,'${name}','${age}')`;
        db.query(sql,(err,data)=>{
            if(err){
                res.send({err:1,msg:"数据库方面有问题"});
                res.end();
            }else{
                res.send({
                    err:0,
                    msg:"添加留言成功",
                });
                res.end();
            }
        })
    }
});
//获取某一页留言
server.get('/getPageData',(req,res)=>{
    let n = req.query.page; //当前第几页

    let sql = `select * from users order by id desc limit ${(n-1)*page_size},${page_size}`;
    db.query(sql,(err,data)=>{
        if(err){
            res.send({err:1,msg:"数据库方面有问题"});
            res.end();
        }else{
            res.send(data);
            res.end();
        }
    })
});
//获取页码
server.get(`/getPageCount`,(req,res)=>{
    let sql=`select count(*) as count from users`;
    db.query(sql,(err,data)=>{
        if(err){
            res.send({err:1,msg:"数据库链接有问题"});
            res.end();
        }else{
           // console.log(data[0].count);
            let n = Math.ceil(data[0].count/page_size);
            res.send({err:0,count:n});
            res.end();
        }
    });
});
server.use(static('vuehtml'));