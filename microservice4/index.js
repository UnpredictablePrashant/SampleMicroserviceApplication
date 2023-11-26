const express = require('express')
const app = express()

app.get('/user', (req,res)=>{
    res.send({'msg':'Microservice 4: User Said Namaste'})
})

app.listen(3003, ()=>{
    console.log('Microservice 4 is listening at port 3003')
})