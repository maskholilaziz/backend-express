// import express
const express = require("express");

// import prisma client
const prisma = require("../prisma/client");

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

module.exports = { findUsers };