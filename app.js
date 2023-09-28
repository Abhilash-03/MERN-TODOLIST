require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connectDB');
const mainRouters = require('./routes/todoRoute');
const registerRouter = require('./routes/authRoute');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

// Middlewares
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("<h1>Todo List App</h1>");
})

// Routes
app.use('/api/v1/todos', mainRouters);
app.use('/api/v1/auth', registerRouter);

app.use(notFound);
app.use(errorHandler);

const start = async()=>{
    try{
        connectDB(process.env.MONGO_URI);
        app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}...`));
    }
     catch(err){
        console.log(err);
     }
}

start();