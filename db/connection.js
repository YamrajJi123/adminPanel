require('dotenv').config();

const mongoose=require('mongoose')
async function connection(){
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("DB yes")
}
connection().catch(err=>console.log(err));