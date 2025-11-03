// import express
const express = require("express");

// import validationResult
const { validationResult } = require("express-validator");

// import bcryptjs
const bcryptjs = require("bcryptjs");

// import prisma client
const prisma = require("../prisma/client");

// function register
const register = async (req, res) => {
    // Pemeriksa hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Jika ada errpr, kembalikan error ke pengguna
        return res.status(422).json({
            success: false,
            message: "Validation Error",
            errors: errors.array()
        });
    }

    // hash password
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    try {
        // insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        });

        // kembalikan respon
        res.status(201).json({
            success: true,
            message: "Register successfully",
            data: user
        });
    } catch (error) {
        // kembalikan error ke pengguna
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = { register };