const express = require('express')
const fetch = require('node-fetch');

require('dotenv').config()

const app = express()

app.get('/', (req,res)=>{
    res.send('Hello World!')
})

app.get('/ms2', async (req,res)=>{
    const apiRes = await fetch(`${process.env.MS2}/user`)
    const apiResJson = await apiRes.json()
    console.log(apiResJson)    
    res.send(apiResJson)
})

app.get('/ms3', async (req,res)=>{
    const apiRes = await fetch(`${process.env.MS3}/user`)
    const apiResJson = await apiRes.json()
    console.log(apiResJson)
    res.send(apiResJson)
})

app.get('/ms4', async (req,res)=>{
    const apiRes = await fetch(`${process.env.MS4}/user`)
    const apiResJson = await apiRes.json()
    console.log(apiResJson)
    res.send(apiResJson)
})

app.listen(3000, ()=>{
    console.log('Microservice 1 is listening at port 3000')
})