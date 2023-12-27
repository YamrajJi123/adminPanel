const express=require('express')
const app=express()
const routes=app.use(express.Router())

const data=require('../controller/adminController')
const {auth} =require('../Middleware/auth')
const {upload}=require('../help/formidable')


app.post('/adminLogin',data.adminLogin)
app.post('/addUser',auth,data.adminAddUser)
app.put('/updateUser/:id',auth,data.adminUpdateUd)
app.delete('/deleteuser/:id',auth,data.deleteUser)
app.get('/getUsers',auth,data.getUsers)
app.get('/getUser/:id',auth,data.getUser)
app.post('/uploads',upload,data.data)


exports.routes=routes;