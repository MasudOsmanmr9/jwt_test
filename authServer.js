require('dotenv').config()

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken')

app.use(express.json())

var refreshTOkens = []

app.post('/token',(req,res)=>{
    const refreshtoken = req.body.token;
    if(!refreshtoken == null) return res.sendStatus(401);
    if(!refreshTOkens.includes(refreshtoken)) return res.sendStatus(403);
    jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403);
        let temp = { username: user.username, userAge: user.userAge}
        const accesstoken = generateAccessToken(temp);
        res.json({accesstoken:accesstoken});
    })
 
})

app.post('/login', (req,res)=>{
    // const username = req.body.username
    // const user = {name:username}
    const user = req.body;

    const accesstoken = generateAccessToken(user);
    const refreshTOken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTOkens.push(refreshTOken);
    res.json({accesstoken:accesstoken,refreshtoken:refreshTOken});
})

app.delete('/logout',(req,res)=>{
    refreshTOkens = refreshTOkens.filter(token => token != req.body.token);
    res.sendStatus(204);
})

function generateAccessToken(user){
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'});
    return accesstoken;
}


app.listen(4000,()=>{
    console.log('server started at 4000' );
});