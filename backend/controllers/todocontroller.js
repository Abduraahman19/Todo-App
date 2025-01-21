const Todo = require('../models/Todo');

// Create a new to-do
const createTodo = async (req, res) => {
  const { title, description, date, backgroundColor, userId } = req.body;
  try {
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
  const userId = req.user.id;

  try {
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a to-do
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, backgroundColor } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, date, backgroundColor },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'To-do not found' });
    }

    res.status(200).json({ message: 'To-do updated successfully', updatedTodo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a to-do
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'To-do not found' });
    }

    res.status(200).json({ message: 'To-do deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
