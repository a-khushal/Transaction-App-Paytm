const express = require("express");
const {User} = require("../db");
const router = express.Router();
const zod = require("zod");
const JWT_SECRET = require("../config")
const jwt = require("jsonwebtoken");

const signUpValidationSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

router.post("/signup", async(req, res)=>{
    const {success} = signUpValidationSchema.safeParse(req.body);
    const existingUser = await User.findOne({
        username: req.body.username
    });
    if(!success || existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const newUser = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    });

    const userId = newUser._id;

    const token = jwt.sign({
        userId,
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router