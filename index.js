const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const PORT = 8000;
const app = express();


// Connect to MongoDB 
mongoose.connect('mongodb://localhost:27017/todoDb')
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log("MongoDB connection error:", error.message);
});

const todoSchema = new mongoose.Schema({
    title: {type: String,required: true,unique: true,maxlength:20,minlength:3,trim: true}, // fild:datatype+validation
    // fild:datatype
    description: {type: String,required: true,unique: true,maxlength:100,minlength:3,trim: true},   
},
{
    timestamps: true
}
);

const Todo = mongoose.model('Todo', todoSchema);
// Set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


// Route
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        res.locals.mymoment = moment; // Make moment available in all EJS templates

        res.render('index',{title: "Todo List", todos: todos}); // Make sure index.ejs exists in views folder
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/add-todo', (req, res,next) => {
    try {
        res.render('newTodo',{title: "Add Todo"}); // Make sure newTodo.ejs exists in views folder
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/update-todo', (req, res,next) => {
    try {
        res.render('updateTodo',{title: "Update Todo"}); // Make sure updateTodo.ejs exists in views folder   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
   
app.get('/delete-todo', (req, res,next) => {
    try {
        res.render('deleteTodo',{title: "Delete Todo"}); // Make sure deleteTodo.ejs exists in views folder
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
});

app.post('/add-todo', async (req, res,next) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
