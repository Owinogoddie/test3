const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./models/todo');



const app = express();

app.use(cors());
app.use(express.json());

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a todo
app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: false,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const port = process.env.PORT || 5000;
const url="mongodb://localhost/todos"
mongoose.connect(process.env.MONGO_URI || url)
.then(()=>{  

app.listen(process.env.PORT,()=>{
    console.log(`connected to db and app running on ${port}`)
})

})
.catch((error)=>{
    console.log(error)
})
