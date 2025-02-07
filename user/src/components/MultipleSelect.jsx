import React, { useState, useEffect } from "react";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function SingleSelect() {
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/todos", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const today = new Date().toLocaleDateString();

            const todayTodos = response.data.todos.filter(todo => {
                return new Date(todo.date).toLocaleDateString() === today;
            });

            const uniqueTodos = todayTodos.reduce((acc, current) => {
                if (!acc.find(item => item.title === current.title)) {
                    acc.push(current);
                }
                return acc;
            }, []);

            setTodos(uniqueTodos);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleChange = (event) => {
        setSelectedTodo(event.target.value);
    };

    return (
        <FormControl
            sx={{
                m: 1,
                width: 300,
                marginLeft: { xs: -1, sm: 2 },
            }}
        >
            <InputLabel id="todo-select-label">Select Task</InputLabel>
            <Select
                labelId="todo-select-label"
                id="todo-select"
                value={selectedTodo}
                onChange={handleChange}
                input={<OutlinedInput label="Select Task" />}
                MenuProps={MenuProps}
            >
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <MenuItem 
                            key={todo._id} 
                            value={todo.title} 
                            style={{ backgroundColor: todo.backgroundColor || "#f0f0f0", color: "#ffffff" }}
                        >
                            {todo.title}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled style={{ color: "#ffffff" }}>No tasks for today</MenuItem>
                )}
            </Select>
        </FormControl>
    );
}
