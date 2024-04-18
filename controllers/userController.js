// userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;




//create User

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
    const newUser = new User ({ name, email, password, role });
    await newUser.save();

    res.status(201).json({
        message: "User created successfully!",
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role}
    });
    } catch(error) {
        res.status(400).json({ message: "Error creating user", error: error.message});
    }
};

// get all users 

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

// get user by ID 

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password');
        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }
        res.json(user);
    } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message});
    }
}

// update user by ID

exports.updateUser =  async (req, res) => {
    const  { id } = req.params;
    let { password, ...updateData } = req.body;
    
    try {
        if (password) {
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            password = await bcrypt.hash(password, salt);
            updateData.password = password;
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }

        Object.assign(user, updateData);
        await user.save(); //trigges pre save middleware for hashing

        res.json({ message: 'User updated successfully!', user: { id: user._id, name: user.name, email: user.email, role: user.role } });

} catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
}
};

//delete user 

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found"})
        }
        res.json({ message: "User deleted successfully", userId: deletedUser._id});
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message});
    }
};