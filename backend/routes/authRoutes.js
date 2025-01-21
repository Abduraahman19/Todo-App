const express = require('express');
const router = express.Router();
const { signUp, signIn, getUserById, getAllUsers } = require('../controllers/authcontroller');

// Sign Up Route
router.post('/signup', signUp);

// Sign In Route
router.post('/signin', signIn);

// Get User by ID Route
router.get('/user/:id', getUserById);

// Get All Users Route
router.get('/users', getAllUsers);

module.exports = router;
