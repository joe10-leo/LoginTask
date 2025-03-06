const express = require('express');
const cors= require('cors');
const mysql= require("mysql2");
const jwt= require("jsonwebtoken");

const app= express();
app.use(cors())
app.use(express.json());

const secrect_key = "key";

const db={
    host:'localhost',
    user:'root',
    password:'12345',
    database:'login'
}

const conn = mysql.createConnection(db);
conn.connect((err)=>{
    if(err) throw err;
    console.log("MySql connect...");
})

app.post('/login',(req,res)=>{
    const {email,password} = req.body;

    console.log("Received Email and Password",email,password);
    
const query = "SELECT * FROM users WHERE email = ? ";
conn.query(query,[email],(err,result)=>{
    
    if(err){
       return res.status(500).send({message:"Server Error"})
    }
    
    if(result.length===0){
      return  res.status(400).send({message:"UnKnown Email"})
    }
    
    let user= result[0];

    console.log("Get Email and Password",user.email,user.password);
    
    if(password!==user.password){
     return res.status(401).send({message:"Password Doesn't Match"})
    } 

    let token = jwt.sign({id:user.userId},secrect_key,{expiresIn:"10h"})
    return res.status(200).send({status:200,token,id:user.userId})
    })
})


app.listen(3003, () => {
    console.log(`Server is running on port 3003`);
  });