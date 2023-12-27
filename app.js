const express=require('express')
const app=express()
const cors=require('cors')
app.use(express.json())

const { swaggerServe, swaggerSetup } = require('./swagger/data')

app.use(cors())
app.use(cors({
    origin:'*',
    credentials:true,
}))
require('dotenv').config()
require('./db/connection')

app.use("/api-docs", swaggerServe, swaggerSetup); 

const adminR=require('./Router/adminRouter')

app.use('/admin',adminR.routes)



app.listen(process.env.PORT,()=>{
    console.log("Server yes on port number",process.env.PORT);
})