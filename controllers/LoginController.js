// import express
const express = require("express");

// Import validationResult
const { validationResult } = require("express-validator");

// import bcryptjs
const bcryptjs = require("bcryptjs");

// import jsonwebtoken
const jwt = require("jsonwebtoken");

// import prisma client
const prisma = require("../prisma/client");

// function login
const login = async (req, res) => {
    // Periksa hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation Error",
            errors: errors.array()
        });
    }

    try {
        // find user
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });

        // user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User and password not matched"
            });
        }

        // compare password
        const validPassword = await bcryptjs.compare(req.body.password, user.password);

        // pass not valid
        if (!validPassword) {
            return res.status(404).json({
                success: false,
                message: "User and password not matched"
            });
        }

        //generate token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        // Destructure to remove password from user object
        const { password, ...userWithoutPassword } = user;

        // return response
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                token: token,
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

module.exports = { login };