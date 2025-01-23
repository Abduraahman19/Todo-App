const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');

// Create a new to-do
const createTodo = async (req, res) => {
  const { title, description, date, backgroundColor } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const todo = new Todo({
      title,
      description,
      date,
      backgroundColor,
      userId,
    });

    await todo.save();
    res.status(201).json({ message: 'To-do created successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all to-dos for a user
const getTodos = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const todos = await Todo.find({ userId });
    res.status(200).json({ message: 'To-dos fetched successfully', todos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a specific to-do by ID
const getTodoById = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the to-do by ID and ensure it belongs to the user
    const todo = await Todo.find({ userId: userId });

    if (!todo) {
      return res.status(404).json({ message: 'To-do not found or not authorized' });
    }

    res.status(200).json({ message: 'To-do fetched successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a specific to-do
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, backgroundColor } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find and update only if the to-do belongs to the user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { title, description, date, backgroundColor },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'To-do not found or not authorized' });
    }

    res.status(200).json({ message: 'To-do updated successfully', updatedTodo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a specific to-do
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find and delete only if the to-do belongs to the user
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'To-do not found or not authorized' });
    }

    res.status(200).json({ message: 'To-do deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
