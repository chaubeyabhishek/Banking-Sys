const express = require("express");
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailServices");

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const isExists = await userModel.findOne({ email: email });

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with email",
                status: "failed"
            });
        }

        const user = await userModel.create({
            email, password, name
        });

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token);

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

        await emailService.sendRegistrationEmail(user.email , user.name)
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            message: "Something went wrong",
            status: "failed"
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Email or password is INVALID"
            });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Email or password is INVALID"
            });
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token);

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Something went wrong, please try again later"
        });
    }
};



