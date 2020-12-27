//importing modules
const mysql = require('mysql');
const express = require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const flash=require('connect-flash');
//express app declared
var app = express();
global.currentUser = "";
//configuring express server
app.use(express.json())    // <==== parse request body as JSON
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(require('express-session')({
    secret:"the olx webapp secret cryptography code",
    resave:false,
    saveUninitialized:false
}))
app.use(function(req,res,next){
    //res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    res.locals.info=req.flash('info');
    next();
})

//middleware used here
//const routes = require('./src/routes');
//app.use('/',routes);
const mysqlConnection=require('./src/db.js');

app.get('/',function(req,res){
    res.render("landing.ejs");
})
app.get('/login',function(req,res){
    res.render('login');
})

app.get('/signUp',function(req,res){
    res.render('signUp');
})

app.post('/signup',(req,res)=>{
        console.log(req.body.username);
        let user1={
          username:req.body.username,
          phone:req.body.phone,
          pin:req.body.pin,
        };
        let user2={
          pin:req.body.pin,
          city:req.body.city,
          state:req.body.state,
        }
        let login={
            username:req.body.username,
            password:req.body.password,
        }
        let sql1='INSERT INTO auth SET ?';
        let sql2='INSERT INTO users1 SET ?';
        let sql3='INSERT INTO users2 SET ?';
        let query1=mysqlConnection.query(sql2,user1,(err,results)=>{
          console.log(err);
          let query2=mysqlConnection.query(sql3,user2,(err,results)=>{
            let query3=mysqlConnection.query(sql1,login,(err,results)=>{
                currentUser=req.body.username;
                res.redirect('/products');
            })
          })
        })
})
app.get('/logout',function(req,res){
  currentUser="";
  res.redirect("/products");
})
app.get('/products',function(req,res){
    res.render("products/index",{products:[]});
})
app.get('/products/new',(req,res)=>{
  if(!currentUser){
    req.flash("error","please login first");
    res.redirect("/login");
  }
  res.render("products/new");
})
//change port here
const port = process.env.PORT || 3000;
app.listen(port,()=> console.log('Listening on port :',port))