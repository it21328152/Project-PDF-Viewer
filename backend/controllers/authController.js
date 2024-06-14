const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);  // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await user.matchPassword(password);
    console.log('Stored Hash:', user.password);  // Debugging
    console.log('Password Correct:', isPasswordCorrect);  // Debugging

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token if the password is correct
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);  // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { signup, login };
