const mongoose=require('mongoose')

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    }
},{timestamps:true})

const user= mongoose.model("user",schema)
module.exports=user