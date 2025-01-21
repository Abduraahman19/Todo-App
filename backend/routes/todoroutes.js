const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const { createTodo, updateTodo, getTodos, deleteTodo } = require('../controllers/todocontroller');

// Create a new Todo
router.post('/todo', authMiddleware, createTodo); // Ensure user is authenticated

// Update an existing Todo
router.put('/todo/:id', authMiddleware, updateTodo); // Ensure user is authenticated

// Get all Todos
router.get('/todos', authMiddleware, getTodos); // Ensure user is authenticated

// Delete a Todo
router.delete('/todo/:id', authMiddleware, deleteTodo); // Ensure user is authenticated

module.exports = router;
