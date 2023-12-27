const User = require('../Model/userModel')
const admin = require('../Model/adminModel')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const response = require('../help/response')
const message = require('../help/message')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');


exports.data = async (req, res) => {
    const data = req.body
    const data1 = {};
    Object.keys(data).forEach((a) => {
        data1[a] = data[a][0];
    });
    console.log(data1)
    res.send("yes")
}

exports.adminLogin = [
    body('email').isEmail().withMessage(message.EMAIL_MUST_VALID),
    body("password").isLength({ min: 8 }).withMessage(message.PASSWORD_MUST_MIN_8_CHARACTER),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return response.errorResponse(res, result.array()[0].msg);
        } else {
            let { email, password } = req.body
            const v = await admin.findOne({ email: email });
            if (!v) {
                return response.errorResponse(res, message.WRONG_EMAIL)
            } if (v.type != "admin") {
                return response.errorResponse(res, "You are not authorized to access this api.")
            }
            else {
                await bcrypt.compare(password, v.password, (err, rem) => {
                    if (err) {
                        console.log(err);
                        return response.errorResponse(res, err)
                    }
                    if (rem && email == v.email) {
                        const token = jwt.sign({ id: v._id }, process.env.JWT_SECRET);
                        return response.successResponseWithToken(res, token, message.LOGIN_SUCCESSFULLY);
                    } else {
                        return response.successResponse(res, message.INCORRECT_PASSWORD);
                    }
                })
            }
        }
    }];


exports.adminAddUser = async (req, res) => {
    let data = req.body
    let id = req.currentUser
    let data1 = await admin.findOne({ _id: id })
    let data3 = await User.findOne({ email: data.email })
    if (data3) {
        return response.userAlready(res, "This user is already registered.")
    }
    else {
        if (data1.type == "admin") {
            function validateUser(user) {
                const JoiSchema = Joi.object({
                    phone: Joi.number().required(),
                    name: Joi.string().min(4).max(30).required(),
                    email: Joi.string().email(),
                    city: Joi.string().min(4).max(20).required(),
                    state: Joi.string().min(4).max(20).required(),
                    country: Joi.string().min(4).max(20).required(),
                }).options({ abortEarly: false });
                return JoiSchema.validate(user)
            }
            const response1 = validateUser(data);
            if (response1.error) {
                console.log(response1.error.details)
                response.errorResponse(res, response1.error.details)
            } else {
                let data1 = {
                    name: data.name,
                    city: data.city,
                    email: data.email,
                    state: data.state,
                    phone: data.phone,
                    country: data.country
                }
                let data2 = await User.insertMany([data1])
                response.successResponse(res, message.USER_ADD)
            }
        }
        else {
            response.unAuthorizedResponse(res, message.ADD_ERROR)
        }
    }
}

exports.deleteUser = async (req, res) => {
    let data = req.body
    let id = req.currentUser
    let user=req.params.id
    let data1 = await admin.findOne({ _id: id })
    if (data1.type == "admin") {
        await User.deleteOne({ _id: user })
        response.successResponse(res, message.USER_DELETE)
    } else {
        response.errorResponse(res, message.DELETE_ERROR)
    }
}

exports.adminUpdateUd = async (req, res) => {
    let data = req.body
    let id = req.currentUser
    let user=req.params.id
    let data1 = await admin.findOne({ _id: id })
    console.log(data)
    
    if (data1.type == "admin") {
        function validateUser(user) {
            const JoiSchema = Joi.object({
                phone: Joi.string(),
                name: Joi.string().min(4).max(30),
                email: Joi.string().email(),
                city: Joi.string().min(4).max(20),
                state: Joi.string().min(4).max(20),
                country: Joi.string().min(4).max(20),
            }).options({ abortEarly: false });

            return JoiSchema.validate(user)
        }
        const response1 = validateUser(data);
        if (response1.error) {
            response.errorResponse(res, response1.error.details)
        } else {
            let data2 = {
                name: data.name,
                city: data.city,
                email: data.email,
                state: data.state,
                phone: data.phone,
                country: data.country
            }
            await User.updateOne({ _id: user }, data2, { new: true })
            response.successResponse(res, message.USER_UPDATE)
        }
    } else {
        response.errorResponse(res, message.UPDATE_ERROR)
    }
}


exports.getUsers = async (req, res) => {
    let id = req.currentUser
    let data1 = await admin.findOne({ _id: id })
    if (data1.type == "admin") {
        let users = await User.find({})
        res.status(200).json({ users: users })
    } else {
        response.errorResponse(res, "you are not admin")
    }
}

exports.getUser =async(req,res)=>{
    let id=req.currentUser
    let id1=req.params.id
    console.log(id1)
    let data1 = await admin.findOne({ _id:id })
    if (data1.type == "admin") {
        let user = await User.findOne({_id:id1})
        res.status(200).json({ users: user })
    } else {
        response.errorResponse(res, "you are not admin")
    }


}






// exports.addAdmin= async(req,res)=>{
//     let data= req.body
//     await admin.insertMany([data])
//     res.send("yes")
// }


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODU1NTA3MWYyZDQyODZmYjMxNGI0NyIsImlhdCI6MTcwMzIzOTU2NX0.ZWrZuBQf0950u5r7HMKfwN-mXN98sZDMLB8O81kP-4k