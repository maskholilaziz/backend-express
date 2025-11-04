// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

// Import validationResult
const { validationResult } = require("express-validator");

// import bcryptjs
const bcryptjs = require("bcryptjs");

// function findUsers
const findUsers = async (req, res) => {
    try {
        // find users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            },
            where: {
                deleted_at: null
            },
            orderBy: {
                created_at: "desc"
            }
        });

        // kembalikan respon
        res.status(200).json({
            success: true,
            message: "Get all users successfully",
            data: users
        });
    } catch (error) {
        // kembalikan error
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// function createUser
const createUser = async (req, res) => {
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
        // kembalikan error
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// function findUserById
const findUserById = async (req, res) => {

    // get ID from params
    const { id } = req.params;

    try {
        // find user
        const user = await prisma.user.findFirst({
            where: {
                id: id,
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        // user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // kembalikan respon
        res.status(200).json({
            success: true,
            message: "Get user successfully",
            data: user
        });
    } catch (error) {
        // kembalikan error
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// function updateUser
const updateUser = async (req, res) => {
    // get ID from params
    const { id } = req.params;

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

    // hash password
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    try {
        // get user By ID
        const user = await prisma.user.findFirst({
            where: {
                id: id,
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        // user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // update user
        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        });

        // kembalikan respon
        res.status(200).json({
            success: true,
            message: "Update user successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = { findUsers, createUser, findUserById, updateUser };