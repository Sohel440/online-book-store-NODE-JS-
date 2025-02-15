const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Book } = require('../models/book');
const { jwtMiddleware } = require('../jwt');// ✅ Correct import
const { Order } = require('../models/order');
const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user && user.role === 'admin';
    } catch (err) {
        console.error(err);
        return false;
    }
};
router.post('/', jwtMiddleware, async (req, res) => {
    try {
        if (await isAdmin(req.user.id))
            return res.status(403).json({ message: 'Admin does not make any order' });

        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const data = { ...req.body, userId }; // Ensure userId is included
        const response = await new Order(data).save(); 

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error!" });
    }
});

router.get('/:userId', jwtMiddleware, async (req, res) => {
    try {
        if (await isAdmin(req.user.id)) {
            return res.status(403).json({ message: "You are an admin" });
        }

        const userId = req.params.userId;
        const response = await Order.find({ userId }); 

        if (!response || response.length === 0) {
            return res.status(404).json({ error: "No orders found for this user" });
        }

        res.status(200).json(response);
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id", jwtMiddleware, async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id))) {
            return res.status(403).json({ message: "User does not have admin role" });
        }

        const orderId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Order status is required" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found!" });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
