const express = require('express');
const router = express.Router();
const { 
  createTodo, 
  updateTodo, 
  getTodos, 
  deleteTodo, 
  getTodoById // Import the new controller function
} = require('../controllers/todocontroller');

// Create a new Todo
router.post('/todo', createTodo); // Ensure user is authenticated

// Update an existing Todo
router.put('/todo/:id', updateTodo); // Ensure user is authenticated

// Get all Todos
router.get('/todos', getTodos); // Ensure user is authenticated

// Get a specific Todo by ID
router.get('/gettodo', getTodoById); // Ensure user is authenticated

// Delete a Todo
router.delete('/todo/:id', deleteTodo); // Ensure user is authenticated

module.exports = router;
